{{ define "backend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{ define "backend.labels" }}
{{- if .Values.labels }}
{{- toYaml .Values.labels | nindent 4 }}
{{- else }}
{{- include "backend.selectorLabels" . }}
{{- end }}
{{- end }}

{{ define "backend.selectorLabels" }}
  app.kubernetes.io/name: {{ include "backend.name" . }}
  app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

