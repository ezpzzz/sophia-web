<template>
  <div v-if="overallStatus.status !== 'OK'" class="service-status">
    <!-- Collapsible header -->
    <div class="status-header" @click="isExpanded = !isExpanded">
      <div class="status-summary">
        <span class="dot" :class="overallStatus.status.toLowerCase()"></span>
        <h3 class="status-title">
          {{ isExpanded ? 'Service Status' : getSummaryText() }}
        </h3>
      </div>
      <button class="expand-button" :class="{ 'is-expanded': isExpanded }">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>

    <!-- Expandable content -->
    <div class="status-grid" v-show="isExpanded">
      <div v-for="service in services" 
           :key="service.name" 
           class="status-item">
        <div class="status-icon">
          <span class="dot" :class="service.status.toLowerCase()"></span>
        </div>
        <div class="status-details">
          <span class="service-name">
            {{ service.name }}
            <a :href="service.statusPageUrl" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="status-link"
               title="View detailed status">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </span>
          <span class="status-text">{{ service.statusText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceStatus',
  data() {
    return {
      isExpanded: false,
      services: [
        {
          name: 'Primary AI Agent',
          status: 'OK',
          statusText: 'Operational',
          endpoint: 'https://api.anthropic.com/v1/messages',
          model: 'claude-3-5-sonnet-20241022',
          statusPageUrl: 'https://status.anthropic.com/'
        },
        {
          name: 'Knowledge Base',
          status: 'OK',
          statusText: 'Operational',
          components: [
            {
              name: 'Vector Database',
              endpoint: 'https://api.pinecone.io',
              namespace: 'company-knowledgebase',
              statusPageUrl: 'https://status.pinecone.io/'
            },
            {
              name: 'Embeddings Service',
              endpoint: 'https://api.openai.com/v1/embeddings',
              model: 'text-embedding-ada-002',
              statusPageUrl: 'https://status.openai.com/'
            },
            {
              name: 'LLM Processing',
              endpoint: 'https://api.groq.com/v1/chat/completions',
              model: 'llama-3.3-70b-versatile',
              statusPageUrl: 'https://groqstatus.com/',
              details: {
                contextLength: '128k',
                speed: '276 tokens/sec',
                pricing: {
                  input: '$0.59/M tokens',
                  output: '$0.79/M tokens'
                }
              }
            }
          ],
          statusPageUrl: 'https://status.pinecone.io/'
        },
        {
          name: 'Sophosic Backend',
          status: 'OK',
          statusText: 'Operational',
          endpoint: 'https://n8n.sophosic.ai',
          statusPageUrl: 'https://status.render.com/'
        }
      ],
      checkInterval: null
    }
  },
  methods: {
    async checkServiceStatus(service) {
      try {
        if (service.name === 'Knowledge Base') {
          // Check all components of the Knowledge Base
          let componentStatuses = await Promise.all(service.components.map(async (component) => {
            let statusUrl;
            let status = 'OK';
            let statusText = 'Operational';

            switch(component.name) {
              case 'Vector Database':
                statusUrl = 'https://status.pinecone.io/api/v2/status.json';
                break;
              case 'Embeddings Service':
                statusUrl = 'https://status.openai.com/api/v2/status.json';
                break;
              case 'LLM Processing':
                statusUrl = 'https://groqstatus.com/api/v2/status.json';
                break;
            }

            try {
              const response = await fetch(statusUrl);
              const data = await response.json();
              
              if (data.status.indicator === 'none') {
                status = 'OK';
                statusText = 'Operational';
              } else if (data.status.indicator === 'minor') {
                status = 'WARN';
                statusText = 'Degraded Performance';
              } else {
                status = 'CRIT';
                statusText = 'Service Disruption';
              }
            } catch (error) {
              console.error(`Error checking ${component.name} status:`, error);
              status = 'WARN';
              statusText = 'Status Unknown';
            }

            return { status, statusText };
          }));

          // Determine overall Knowledge Base status
          if (componentStatuses.some(s => s.status === 'CRIT')) {
            service.status = 'CRIT';
            service.statusText = 'Service Disruption';
          } else if (componentStatuses.some(s => s.status === 'WARN')) {
            service.status = 'WARN';
            service.statusText = 'Degraded Performance';
          } else if (componentStatuses.every(s => s.status === 'OK')) {
            service.status = 'OK';
            service.statusText = 'Operational';
          } else {
            service.status = 'WARN';
            service.statusText = 'Partially Operational';
          }
        } else {
          // Handle other services as before
          let statusUrl;
          switch(service.name) {
            case 'Primary AI Agent':
              statusUrl = 'https://status.anthropic.com/api/v2/status.json';
              break;
            case 'Sophosic Backend':
              statusUrl = 'https://status.render.com/api/v2/status.json';
              break;
          }

          if (statusUrl) {
            const response = await fetch(statusUrl);
            const data = await response.json();
            this.updateServiceStatus(service, data);
          }
        }
      } catch (error) {
        console.error(`Error checking ${service.name} status:`, error);
        service.status = 'WARN';
        service.statusText = 'Status Unknown';
      }
    },

    updateServiceStatus(service, data) {
      if (data.status.indicator === 'none') {
        service.status = 'OK';
        service.statusText = 'Operational';
      } else if (data.status.indicator === 'minor') {
        service.status = 'WARN';
        service.statusText = 'Degraded Performance';
      } else {
        service.status = 'CRIT';
        service.statusText = 'Service Disruption';
      }
    },
    
    async checkAllServices() {
      for (const service of this.services) {
        await this.checkServiceStatus(service);
      }
    },

    getSummaryText() {
      if (this.overallStatus.status === 'OK') {
        return 'All Systems Operational';
      } else if (this.overallStatus.status === 'WARN') {
        return 'Degraded Performance';
      } else if (this.overallStatus.status === 'CRIT') {
        return 'Service Disruption';
      }
      return 'Checking System Status...';
    }
  },
  mounted() {
    // Check status immediately
    this.checkAllServices();
    
    // Then check every 5 minutes
    this.checkInterval = setInterval(() => {
      this.checkAllServices();
    }, 5 * 60 * 1000);
  },
  beforeUnmount() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  },
  computed: {
    overallStatus() {
      // If any service is CRIT, overall status is CRIT
      if (this.services.some(service => service.status === 'CRIT')) {
        return {
          status: 'CRIT',
          statusText: 'Service Disruption'
        };
      }
      // If any service is WARN, overall status is WARN
      if (this.services.some(service => service.status === 'WARN')) {
        return {
          status: 'WARN',
          statusText: 'Degraded Performance'
        };
      }
      // If all services are OK, overall status is OK
      if (this.services.every(service => service.status === 'OK')) {
        return {
          status: 'OK',
          statusText: 'Operational'
        };
      }
      // Default status if any service is unknown
      return {
        status: 'WARN',
        statusText: 'Partially Operational'
      };
    }
  },
  watch: {
    overallStatus: {
      handler(newStatus) {
        this.$emit('status-changed', newStatus);
      },
      deep: true
    }
  }
}
</script>