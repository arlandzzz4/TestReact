import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  // SWC 플러그인을 사용하여 빌드 속도를 최적화합니다.
  plugins: [react(),
    // 빌드 시 stats.html 파일을 생성하여 번들 크기를 시각화합니다.
    visualizer({
      filename: './dist/stats.html',
      open: true, // 빌드 완료 후 브라우저에서 자동으로 엽니다.
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      // 컴포넌트 호출 시 '../../' 대신 '@'를 사용하여 가독성을 높입니다.
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  //React.lazy 적용
  build: {
    rollupOptions: {
      output: {
        // 라이브러리와 페이지 코드를 분리하여 브라우저 캐싱을 극대화합니다.
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // 특히 무거운 라이브러리는 별도로 또 뺄 수 있습니다.
            if (id.includes('@tanstack') || id.includes('axios')) {
              return 'data-layer'; // 데이터 관련 라이브러리 그룹
            }
            return 'vendor'; // 그 외 일반 라이브ers
          }
        },
      },
    },
  },
});