// src/index.js
import { registerComponents, registerServices, registerEndpoints, pages } from './registrations.js'

export default {
  install(app) {
    // 1) Register all components
    registerComponents(app)

    // 2) Register all services under $iam
    app.config.globalProperties.$iam = {
      services: {},
      pages: {},
      ENDPOINTS: {}
    }
    registerServices(app)

    // 3) Register ENDPOINTS
    registerEndpoints(app)

    // 4) Expose pages for manual routing
    app.config.globalProperties.$iam.pages = pages

  }
}
