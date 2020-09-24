{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "deployment.envs" }}
env:
  - name: APPINSIGHTS_INSTRUMENTATIONKEY
    valueFrom:
      secretKeyRef:
        name: {{ template "risk-assessment-ui.name" . }}
        key: APPINSIGHTS_INSTRUMENTATIONKEY
  - name: OFFENDERASSESSMENT_API_URL
    value: {{ .Values.env.OFFENDERASSESSMENT_API_URL | quote }}
  - name: INGRESS_URL
    value: 'https://{{ .Values.ingress.host }}'

{{- end -}}
