# Security

- Do not commit `.env`, AWS keys, 4over credentials, customer uploads, proof files, or print-ready files.
- Use AWS Secrets Manager for 4over credentials in deployed environments.
- Use private S3 buckets with block public access and presigned uploads.
- Validate all API inputs with Zod.
- Do not log credentials or presigned artwork URLs.
- Use Cognito groups for future admin access enforcement.
- Use moderation/manual review states before live provider submission.
- Use least-privilege IAM policies and tighten wildcard AI policy resources when model/provider ARNs are finalized.
