FROM n8nio/n8n:latest

# Render uses port 10000 by default
ENV N8N_PORT=10000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:10000/healthz || exit 1

EXPOSE 10000

# Use the default n8n entrypoint
ENTRYPOINT ["n8n"]
