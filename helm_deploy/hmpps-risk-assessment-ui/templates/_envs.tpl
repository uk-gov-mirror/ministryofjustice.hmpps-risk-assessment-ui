{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "deployment.envs" }}
env:
  - name: DEV_ASSESSMENT_ID
    value: {{ .Values.env.DEV_ASSESSMENT_ID | quote}}

  - name: API_CLIENT_ID
    valueFrom:
      secretKeyRef:
        name: {{ .Values.apiClientSecretName }}
        key: API_CLIENT_ID

  - name: API_CLIENT_SECRET
    valueFrom:
      secretKeyRef:
        name: {{ .Values.apiClientSecretName }}
        key: API_CLIENT_SECRET

  - name: AUTH_CLIENT_ID
    valueFrom:
      secretKeyRef:
        name: {{ .Values.authClientSecretName }}
        key: API_CLIENT_ID

  - name: AUTH_CLIENT_SECRET
    valueFrom:
      secretKeyRef:
        name: {{ .Values.authClientSecretName }}
        key: API_CLIENT_SECRET

  - name: APPINSIGHTS_INSTRUMENTATIONKEY
    valueFrom:
      secretKeyRef:
        name: {{ template "risk-assessment-ui.name" . }}
        key: APPINSIGHTS_INSTRUMENTATIONKEY

  - name: REDIS_HOST
    valueFrom:
      secretKeyRef:
        name: {{ .Values.redis.secret }}
        key: primary_endpoint_address

  - name: REDIS_PASSWORD
    valueFrom:
      secretKeyRef:
        name: {{ .Values.redis.secret }}
        key: auth_token

  - name: REDIS_TLS_ENABLED
    value: {{ .Values.redis.tlsEnabled | quote }}

  - name: HMPPS_ASSESSMENT_API_URL
    value: {{ .Values.env.HMPPS_ASSESSMENT_API_URL | quote }}

  - name: OFFENDER_ASSESSMENT_API_URL
    value: {{ .Values.env.OFFENDER_ASSESSMENT_API_URL | quote }}

  - name: OAUTH_ENDPOINT_URL
    value: {{ .Values.env.OAUTH_ENDPOINT_URL | quote }}

  - name: INGRESS_URL
    value: 'https://{{ .Values.ingress.host }}'

  - name: SHOW_DETAILED_ERRORS
    value: {{ .Values.env.SHOW_DETAILED_ERRORS | quote }}

  - name: SHOW_REQUEST_ID_ON_ERROR_PAGE
    value: {{ .Values.env.SHOW_REQUEST_ID_ON_ERROR_PAGE | quote }}

  - name: PDF_CONVERTER_ENDPOINT
    value: {{ .Values.env.PDF_CONVERTER_ENDPOINT | quote }}

{{- end -}}
