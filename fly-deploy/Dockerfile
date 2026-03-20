FROM n8nio/n8n:latest

# Fly.io specific configurations
ENV N8N_PORT=8080
ENV N8N_PROTOCOL=https
ENV NODE_ENV=production
ENV N8N_METRICS=true

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/healthz || exit 1

# Expose port (Fly.io uses 8080 by default)
EXPOSE 8080

# Start n8n
CMD ["n8n"]
