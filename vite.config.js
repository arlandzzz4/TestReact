import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: '/',
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
    // 1. 빌드 시 청크 파일들이 제대로 참조되도록 base 경로 명시 (상황에 따라 '/')
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // 2. 캐시 문제를 방지하기 위해 파일 이름 규칙을 더 명확히 합니다.
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',

        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Quill 에디터 등을 사용하신다면 여기에 포함시켜야 'Not defined' 에러를 막습니다.
            if (id.includes('quill') || id.includes('react-quill')) {
              return 'editor-layer';
            }
            if (id.includes('@tanstack') || id.includes('axios')) {
              return 'data-layer';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});