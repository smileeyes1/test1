
# دليل التشغيل النهائي

## تشغيل الخلفية
```bash
cd backend
npm install
PAL_BRIDGE_TOKEN=قيمة_آمنة npm start
```

## تشغيل الواجهة
افتح الملف:
- `app/index.html`

## الأوامر الخلفية المهمة
- health_check
- validate_policy
- summarize_runtime_status
- create_job
- list_jobs
- process_next_job
- retry_failed_job
- get_audit_tail
- emergency_stop
- clear_emergency_stop

## الأدوار
- viewer
- operator
- auditor
- admin
