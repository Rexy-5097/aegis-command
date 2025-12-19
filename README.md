# 🛡️ Aegis Command System

> **Next-Gen Tactical Command Interface**  
> *Offline-First | AI-Powered | Field-Ready*

Aegis Command is a cutting-edge tactical situational awareness dashboard designed for field operations. It combines local AI processing with robust offline-first architecture to provide real-time threat detection and strategic intelligence without relying on cloud connectivity.

![Aegis Command Interface](https://via.placeholder.com/800x450?text=Aegis+Command+System)

## 🚀 Key Features

- **👁️ Edge AI Vision**: Real-time object detection running entirely in the browser using `@xenova/transformers`. No images are sent to the cloud for inference.
- **📡 Offline-First Architecture**: Powered by **PouchDB**, ensuring full functionality in disconnected environments with automatic synchronization when connectivity is restored.
- **🗺️ Tactical Visualization**: Interactive headers, threat feeds, and status monitors built with a "defense-grade" UI aesthetic.
- **⚡ High Performance**: Built on **Vite** + **React** for near-instant load times and 60fps rendering.

## 🛠️ Technology Stack

- **Core**: React 19, Vite
- **Styling**: TailwindCSS, clsx, tailwind-merge, Lucide React
- **AI/ML**: Transformers.js (On-device inference)
- **Data Layer**: PouchDB (Local-first sync)
- **State Management**: React Hooks (useNetworkStatus, useSync)

## 📂 System Structure

```bash
aegis-command/
├── src/
│   ├── components/
│   │   ├── dashboard/       # Core operational views
│   │   │   ├── CamFeed.jsx      # AI Vision integration & webcam
│   │   │   ├── HQFeed.jsx       # Strategic intelligence stream
│   │   │   ├── ThreatFeed.jsx   # Live detection logs
│   │   │   └── NetworkStatus.jsx # Connection telemetry
│   │   └── layout/          # Application shell (Sidebar, Header)
│   ├── db/
│   │   └── db.js            # PouchDB configuration & persistence logic
│   ├── hooks/
│   │   ├── useNetworkStatus.js # Online/Offline listeners
│   │   └── useSync.js       # Data synchronization logic
│   ├── services/
│   │   └── azureService.js  # External cloud (mock/real) integrations
│   └── utils/
│       └── cotSerializer.js # Chain-of-thought data processing
```

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rexy-5097/aegis-command.git
   cd aegis-command
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the command center**
   ```bash
   npm run dev
   ```

## 🔒 Security & Privacy

- **Local Inference**: Camera feeds are processed locally. Video streams never leave the client device.
- **Encrypted Sync**: (Roadmap) End-to-end encryption for peer-to-peer sync.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

*Mission Critical Systems // Unauthorized Access Prohibited*
