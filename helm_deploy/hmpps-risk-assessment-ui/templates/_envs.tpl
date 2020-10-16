{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "deployment.envs" }}
env:
  - name: API_CLIENT_ID
    valueFrom:
      secretKeyRef:
        name: {{ template "risk-assessment-ui.name" . }}
        key: API_CLIENT_ID

  - name: API_CLIENT_SECRET
    valueFrom:
      secretKeyRef:
        name: {{ template "risk-assessment-ui.name" . }}
        key: API_CLIENT_SECRET

  - name: APPINSIGHTS_INSTRUMENTATIONKEY
    valueFrom:
      secretKeyRef:
        name: {{ template "risk-assessment-ui.name" . }}
        key: APPINSIGHTS_INSTRUMENTATIONKEY

  - name: OFFENDERASSESSMENT_API_URL
    value: {{ .Values.env.ASSESSMENTS_API_URL | quote }}
  - name: INGRESS_URL
    value: 'https://{{ .Values.ingress.host }}'

{{- end -}}
