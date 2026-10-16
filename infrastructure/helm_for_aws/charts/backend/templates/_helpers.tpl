{{- define "backend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "backend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "backend.selectorLabels" }}
  app.kubernetes.io/name: {{ include "backend.name" . }}
  app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "backend.labels" }}
{{- if .Values.labels }}
{{- toYaml .Values.labels | nindent 4 }}
{{- else }}
{{- include "backend.selectorLabels" . }}
{{- end }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "backend.serviceAccountName" -}}
{{- if and .Values.global .Values.global.serviceAccount .Values.global.serviceAccount.name -}}
{{- .Values.global.serviceAccount.name -}}
{{- else if and .Values.global .Values.global.serviceAccount (hasKey .Values.global.serviceAccount "create") (not .Values.global.serviceAccount.create) -}}
{{- "default" -}}
{{- else -}}
{{- printf "%s-sa" .Release.Name -}}
{{- end -}}
{{- end -}}

