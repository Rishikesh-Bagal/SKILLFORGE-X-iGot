# SkillForge AI Security Specification & Test Harness

## Data Invariants
1. A UserProfile can only be read/written by the authenticated user (`request.auth.uid == userId`) or an admin.
2. A user cannot modify their own `role` or elevate themselves to `admin`.
3. QuizAttempt documents must belong to the authenticated officer (`incoming().userId == request.auth.uid`). Once scored, attempts cannot be overwritten by non-admins.
4. CourseEnrollment documents can only be created and updated by the enrolled officer.
5. PeerCircle creation requires valid creator identification matching the current authenticated user.
6. IDs must be valid alphanumeric strings adhering to regex `^[a-zA-Z0-9_\\-]+$` with maximum length of 128 characters.
7. Unauthenticated users have zero read or write access to private profiles, quiz attempts, and course records.

## The "Dirty Dozen" Malicious Payloads
1. **Payload 1 (Identity Spoofing - Impersonating Officer Profile)**: An attacker submits a write to `/users/victim_user_123` with `request.auth.uid = attacker_456`. Expected: PERMISSION_DENIED.
2. **Payload 2 (Privilege Escalation - Role Hijacking)**: A standard employee officer sends an update to `/users/{uid}` changing `role: "admin"`. Expected: PERMISSION_DENIED.
3. **Payload 3 (Path Variable Poisoning - 2KB Junk ID)**: A client creates a document at `/users/` with a 2000-character malicious string key. Expected: PERMISSION_DENIED.
4. **Payload 4 (Ghost Field Injection - Shadow Update)**: An update to `/users/{uid}` contains an undeclared field `__bypassAuth: true`. Expected: PERMISSION_DENIED.
5. **Payload 5 (Unauthenticated Profile Harvesting)**: An unauthenticated client attempts `get` or `list` on `/users`. Expected: PERMISSION_DENIED.
6. **Payload 6 (Forged Assessment Submission)**: A user submits a `QuizAttempt` setting `userId` to another officer's UID. Expected: PERMISSION_DENIED.
7. **Payload 7 (Assessment Score Tampering)**: An officer attempts to update an existing completed `QuizAttempt` to change `score` from 40 to 100. Expected: PERMISSION_DENIED.
8. **Payload 8 (Type Poisoning - Number as String)**: A payload provides `overallCompetency: "expert_grade"` instead of a number. Expected: PERMISSION_DENIED.
9. **Payload 9 (Denial of Wallet - 10MB String in Current Assignment)**: A user injects a multi-megabyte string into `currentAssignment`. Expected: PERMISSION_DENIED.
10. **Payload 10 (Unauthorized Course Enrollment Modification)**: An attacker attempts to modify another officer's `courseEnrollments` record. Expected: PERMISSION_DENIED.
11. **Payload 11 (Orphaned PeerCircle Creation)**: An attacker creates a `peerCircle` with `creatorId` pointing to an external user UID. Expected: PERMISSION_DENIED.
12. **Payload 12 (Blanket List Query Scraping)**: A user attempts an unbounded `list` query across `/quizAttempts` without filtering by their own `userId`. Expected: PERMISSION_DENIED.
