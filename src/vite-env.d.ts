/// <reference types="vite/client" />

declare module 'react-chartjs-2' {
  export const Line: any;
  export const Doughnut: any;
}

declare module 'chart.js/auto' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
} 