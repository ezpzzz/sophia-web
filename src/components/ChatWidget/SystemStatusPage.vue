<template>
  <div class="chat-container">
    <div class="system-status-content">
      <div class="status-card">
        <div class="overall-status" :class="overallStatus.status.toLowerCase()">
          <span class="dot" :class="overallStatus.status.toLowerCase()"></span>
          <h2>{{ getSummaryText() }}</h2>
        </div>

        <div class="services-grid">
          <div v-for="service in services" 
               :key="service.name" 
               class="status-item">
            <div class="status-icon">
              <span class="dot" :class="service.status.toLowerCase()"></span>
            </div>
            <div class="status-details">
              <div class="service-header">
                <div class="service-title">
                  <span class="service-name">{{ service.name }}</span>
                </div>
                <button v-if="service.components"
                        class="status-link expand-button"
                        :class="{ 'is-expanded': expandedServices[service.name] }"
                        @click="toggleService(service.name)"
                        title="View components">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <a v-else 
                   :href="service.statusPageUrl" 
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
              </div>
              <span class="status-text">{{ service.statusText }}</span>
              
              <div v-if="service.components" 
                   class="service-components"
                   :class="{ 'expanded': expandedServices[service.name] }">
                <div v-for="component in service.components" 
                     :key="component.name"
                     class="component-item">
                  <div class="component-header">
                    <span class="component-name">{{ component.name }}</span>
                    <a :href="component.statusPageUrl"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="status-link"
                       title="View provider status">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  </div>
                  <div class="component-details">
                    <span class="component-model">{{ component.model || component.namespace }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="powered-by-section">
        <a href="https://sophosic.ai" 
           target="_blank" 
           rel="noopener noreferrer"
           class="powered-by-link">
          Powered by Sophosic
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemStatusPage',
  props: {
    services: {
      type: Array,
      required: true
    },
    overallStatus: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      expandedServices: {}
    }
  },
  methods: {
    getSummaryText() {
      if (this.overallStatus.status === 'OK') {
        return 'All Systems Operational';
      } else if (this.overallStatus.status === 'WARN') {
        return 'Degraded Performance';
      } else if (this.overallStatus.status === 'CRIT') {
        return 'Service Disruption';
      }
      return 'Checking System Status...';
    },
    toggleService(serviceName) {
      this.expandedServices[serviceName] = !this.expandedServices[serviceName];
      this.$forceUpdate(); // Ensure reactivity
    }
  }
}
</script>

<style scoped>
.chat-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  display: flex;
  flex-direction: column;
}

.system-status-content {
  flex: 1;
  padding: 24px;
  padding-bottom: 0;
  background: #F8F9FE;
  display: flex;
  flex-direction: column;
}

.status-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: auto;
}

.services-grid {
  padding: 16px;
}

.powered-by-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.powered-by-link {
  color: #666666;
  text-decoration: none;
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  transition: color 0.2s ease;
}

.powered-by-link:hover {
  color: #5423E7;
}

.services-grid {
  padding: 16px;
}

.status-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.status-item:hover {
  background-color: #F3F4F6;
}

.status-icon {
  margin-right: 12px;
  padding-top: 4px;
}

.status-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.service-name {
  font-size: 16px;
  font-weight: 500;
  color: #1E1B3C;
}

.status-details .status-text {
  font-size: 14px;
  color: #6B7280;
  opacity: 1;
  transform: none;
  white-space: normal;
  display: block;
  margin-top: 2px;
}

.status-link {
  display: inline-flex;
  align-items: center;
  color: #1E1B3C;
  opacity: 0.4;
  transition: opacity 0.2s ease;
}

.status-link:hover {
  opacity: 0.8;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot.ok {
  background-color: #10B981;
}

.dot.warn {
  background-color: #F59E0B;
}

.dot.crit {
  background-color: #EF4444;
}

.overall-status {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.overall-status h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #1E1B3C;
}

.service-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.expand-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  color: #1E1B3C;
  opacity: 0.4;
  transition: all 0.2s ease;
}

.expand-button:hover {
  opacity: 0.8;
}

.expand-button.is-expanded svg {
  transform: rotate(180deg);
}

.service-components {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  margin-top: 0;
}

.service-components.expanded {
  max-height: 500px; /* Adjust based on expected content height */
  margin-top: 12px;
}

.component-item {
  padding: 8px 12px;
  margin-left: 8px;
  border-left: 1px solid #E5E7EB;
  font-size: 14px;
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.component-name {
  color: #4B5563;
  font-weight: 500;
}

.component-details {
  margin-top: 2px;
}

.component-model {
  color: #6B7280;
  font-size: 12px;
}

/* Ensure smooth transitions */
.expand-button svg {
  transition: transform 0.2s ease;
}
</style>
