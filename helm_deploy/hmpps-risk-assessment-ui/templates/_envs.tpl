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

  - name: HMPPS_ASSESSMENT_API_URL
    value: {{ .Values.env.HMPPS_ASSESSMENT_API_URL | quote }}

  - name: OFFENDER_ASSESSMENT_API_URL
    value: {{ .Values.env.OFFENDER_ASSESSMENT_API_URL | quote }}

  - name: OAUTH_ENDPOINT_URL
    value: {{ .Values.env.OAUTH_ENDPOINT_URL | quote }}

  - name: INGRESS_URL
    value: 'https://{{ .Values.ingress.host }}'

{{- end -}}
