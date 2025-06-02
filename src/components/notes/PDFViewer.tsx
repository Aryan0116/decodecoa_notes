import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Eye, 
  Maximize2, 
  Minimize2, 
  BookOpen,
  Columns,
  Search,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
  RotateCw,
  X,
  Menu,
  FileText,
  Copy,
  Settings,
  Info,
  ArrowUp,
  ArrowDown,
  Home,
  Square
} from 'lucide-react';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string;
  fileName?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, fileName = "document.pdf" }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1.2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'page' | 'continuous' | 'double'>('page');
  const [darkMode, setDarkMode] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pageWidth, setPageWidth] = useState<number>(595); // A4 width in points
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [documentInfo, setDocumentInfo] = useState<any>(null);
  const [fitMode, setFitMode] = useState<'width' | 'page' | 'auto'>('width');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<{ [key: number]: HTMLDivElement }>({});

  // Calculate A4-optimized scale based on container width
  const calculateA4Scale = useCallback(() => {
    const containerWidth = viewerRef.current?.clientWidth || 800;
    const padding = 20; // Minimal padding
    const availableWidth = containerWidth - padding;
    
    // A4 dimensions: 595 x 842 points (72 DPI)
    const a4Width = 595;
    const baseScale = availableWidth / a4Width;
    
    switch (fitMode) {
      case 'width':
        return Math.min(baseScale * zoom, 3);
      case 'page':
        const containerHeight = viewerRef.current?.clientHeight || 600;
        const a4Height = 842;
        const heightScale = (containerHeight - 20) / a4Height;
        return Math.min(Math.min(baseScale, heightScale) * zoom, 3);
      case 'auto':
      default:
        return Math.min(baseScale * zoom, 3);
    }
  }, [zoom, fitMode]);

  const [scale, setScale] = useState(calculateA4Scale());

  // Update scale when container size changes
  useEffect(() => {
    const updateScale = () => {
      setScale(calculateA4Scale());
    };

    const resizeObserver = new ResizeObserver(updateScale);
    if (viewerRef.current) {
      resizeObserver.observe(viewerRef.current);
    }

    window.addEventListener('resize', updateScale);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [calculateA4Scale]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            zoomIn();
            break;
          case '-':
            e.preventDefault();
            zoomOut();
            break;
          case '0':
            e.preventDefault();
            setZoom(1.2);
            break;
          case 'f':
            e.preventDefault();
            toggleFullscreen();
            break;
        }
      } else {
        switch (e.key) {
          case 'ArrowLeft':
            if (viewMode === 'page') goToPrevPage();
            break;
          case 'ArrowRight':
            if (viewMode === 'page') goToNextPage();
            break;
          case 'Home':
            setPageNumber(1);
            break;
          case 'End':
            if (numPages) setPageNumber(numPages);
            break;
          case 'Escape':
            setIsSearchOpen(false);
            setIsSettingsOpen(false);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, numPages]);

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    
    // Get document info if available
    const loadingTask = pdfjs.getDocument(fileUrl);
    loadingTask.promise.then(pdf => {
      pdf.getMetadata().then(metadata => {
        setDocumentInfo(metadata);
      });
    });
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setLoading(false);
  }

  function goToPrevPage() {
    setPageNumber(prev => Math.max(prev - 1, 1));
  }

  function goToNextPage() {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  }

  function zoomIn() {
    setZoom(prev => Math.min(prev + 0.2, 3));
  }

  function zoomOut() {
    setZoom(prev => Math.max(prev - 0.2, 0.4));
  }

  function resetZoom() {
    setZoom(1);
  }

  function rotateClockwise() {
    setRotation(prev => (prev + 90) % 360);
  }

  function jumpToPage(e: React.ChangeEvent<HTMLInputElement>) {
    const pageNum = parseInt(e.target.value);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= (numPages || 1)) {
      setPageNumber(pageNum);
    }
  }

  function scrollToPage(pageNum: number) {
    const pageElement = pageRefs.current[pageNum];
    if (pageElement && viewMode === 'continuous') {
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setPageNumber(pageNum);
  }

  // Copy current page number to clipboard
  function copyPageInfo() {
    const info = `Page ${pageNumber} of ${numPages} - ${fileName}`;
    navigator.clipboard.writeText(info);
  }

  // Generate page array for continuous and double-page modes
  const renderPages = () => {
    if (!numPages) return null;
    
    const pages = [];
    
    if (viewMode === 'double') {
      // Double page view
      for (let i = 1; i <= numPages; i += 2) {
        pages.push(
          <div key={`double-page-${i}`} className="flex justify-center gap-2 mb-2">
            <div 
              ref={el => { if (el) pageRefs.current[i] = el; }}
              className="shadow-lg"
              style={{ lineHeight: 0 }}
            >
              <Page
                pageNumber={i}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className={`${darkMode ? 'invert' : ''} block`}
                scale={scale}
                rotate={rotation}
                style={{ display: 'block', margin: 0, padding: 0 }}
              />
              <div className="text-center text-xs mt-1 text-gray-500">Page {i}</div>
            </div>
            {i + 1 <= numPages && (
              <div 
                ref={el => { if (el) pageRefs.current[i + 1] = el; }}
                className="shadow-lg"
                style={{ lineHeight: 0 }}
              >
                <Page
                  pageNumber={i + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className={`${darkMode ? 'invert' : ''} block`}
                  scale={scale}
                  rotate={rotation}
                  style={{ display: 'block', margin: 0, padding: 0 }}
                />
                <div className="text-center text-xs mt-1 text-gray-500">Page {i + 1}</div>
              </div>
            )}
          </div>
        );
      }
    } else {
      // Continuous single page view
      for (let i = 1; i <= numPages; i++) {
        pages.push(
          <div 
            key={`page-${i}`}
            ref={el => { if (el) pageRefs.current[i] = el; }}
            className="mb-2 flex flex-col items-center"
          >
            <div className="shadow-lg" style={{ lineHeight: 0 }}>
              <Page
                pageNumber={i}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className={`${darkMode ? 'invert' : ''} block`}
                scale={scale}
                rotate={rotation}
                style={{ display: 'block', margin: 0, padding: 0 }}
              />
            </div>
            <div className="text-center text-xs mt-1 text-gray-500">Page {i} of {numPages}</div>
          </div>
        );
      }
    }
    return pages;
  };

  const renderThumbnails = () => {
    if (!numPages) return null;
    
    return Array.from(Array(numPages).keys()).map((i) => (
      <div
        key={`thumb-${i + 1}`}
        className={`cursor-pointer mb-2 p-1 rounded ${pageNumber === i + 1 ? (darkMode ? 'bg-blue-800' : 'bg-blue-100') : ''}`}
        onClick={() => scrollToPage(i + 1)}
      >
        <Page
          pageNumber={i + 1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          scale={0.15}
          className="shadow-sm"
          style={{ display: 'block', margin: 0, padding: 0 }}
        />
        <div className="text-xs text-center mt-1">{i + 1}</div>
      </div>
    ));
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      {/* Top Toolbar */}
      <div className={`flex-shrink-0 p-2 flex justify-between items-center border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-md mr-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
          <FileText size={18} className="mr-2" />
          <h3 className="text-sm font-medium truncate max-w-xs" title={fileName}>
            {fileName}
          </h3>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Search */}
          {isSearchOpen && (
            <div className="flex items-center mr-2">
              <input 
                type="text" 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={`px-2 py-1 text-sm rounded-md w-48 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border`}
                placeholder="Search in document..."
                autoFocus
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className={`p-1 ml-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          {/* <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title="Search"
          >
            <Search size={18} />
          </button> */}
          
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title="Settings"
          >
            <Settings size={18} />
          </button>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className={`flex-shrink-0 p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fit Mode</label>
              <select 
                value={fitMode} 
                onChange={(e) => setFitMode(e.target.value as 'width' | 'page' | 'auto')}
                className={`w-full px-2 py-1 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
              >
                <option value="width">Fit Width</option>
                <option value="page">Fit Page</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Page Width (px)</label>
              <input 
                type="range" 
                min="400" 
                max="800" 
                value={pageWidth} 
                onChange={(e) => setPageWidth(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{pageWidth}px</div>
            </div>
            <div className="flex items-center">
              {/* <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={showThumbnails} 
                  onChange={(e) => setShowThumbnails(e.target.checked)}
                  className="mr-2"
                />
                Show Thumbnails
              </label> */}
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className={`flex-shrink-0 w-64 border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} overflow-auto`}>
            <div className="p-4">
              <div className="flex gap-2 mb-4">
                {/* <button
                  onClick={() => setShowThumbnails(!showThumbnails)}
                  className={`px-3 py-1 rounded text-sm ${showThumbnails ? (darkMode ? 'bg-blue-700' : 'bg-blue-100') : ''}`}
                >
                  Thumbnails
                </button> */}
                <button className="px-3 py-1 rounded text-sm">Outline</button>
              </div>
              
              {showThumbnails ? (
                <div className="space-y-2">
                  {renderThumbnails()}
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className="font-medium mb-3">Pages</h3>
                  {numPages && Array.from(Array(numPages).keys()).map((i) => (
                    <button
                      key={i}
                      onClick={() => scrollToPage(i + 1)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm ${pageNumber === i + 1 ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      Page {i + 1}
                    </button>
                  ))}
                </div>
              )}
              
              {documentInfo && (
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Info size={16} className="mr-1" />
                    Document Info
                  </h4>
                  <div className="text-xs space-y-1">
                    <div><strong>Pages:</strong> {numPages}</div>
                    {documentInfo.info?.Title && <div><strong>Title:</strong> {documentInfo.info.Title}</div>}
                    {documentInfo.info?.Author && <div><strong>Author:</strong> {documentInfo.info.Author}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div 
            ref={viewerRef}
            className={`flex-1 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
          >
            {loading && (
              <div className="flex justify-center items-center h-full">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
                  <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center py-2">
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                className="flex flex-col items-center"
              >
                {viewMode === 'page' ? (
                  <div className="shadow-xl" style={{ lineHeight: 0 }}>
                    <Page
                      pageNumber={pageNumber}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className={`${darkMode ? 'invert' : ''} block`}
                      scale={scale}
                      rotate={rotation}
                      style={{ display: 'block', margin: 0, padding: 0 }}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {renderPages()}
                  </div>
                )}
              </Document>
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className={`flex-shrink-0 p-2 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPageNumber(1)}
                  disabled={pageNumber <= 1}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 disabled:opacity-50' : 'hover:bg-gray-200 disabled:opacity-50'}`}
                  title="First page"
                >
                  <Home size={16} />
                </button>
                
                <button
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 disabled:opacity-50' : 'hover:bg-gray-200 disabled:opacity-50'}`}
                  title="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={numPages || 1}
                    value={pageNumber}
                    onChange={jumpToPage}
                    className={`w-12 text-center px-1 py-1 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border`}
                  />
                  <span className="mx-1">/</span>
                  <span>{numPages}</span>
                </div>
                
                <button
                  onClick={goToNextPage}
                  disabled={pageNumber >= (numPages || 1)}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 disabled:opacity-50' : 'hover:bg-gray-200 disabled:opacity-50'}`}
                  title="Next page"
                >
                  <ChevronRight size={18} />
                </button>
                
                <button
                  onClick={() => numPages && setPageNumber(numPages)}
                  disabled={pageNumber >= (numPages || 1)}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 disabled:opacity-50' : 'hover:bg-gray-200 disabled:opacity-50'}`}
                  title="Last page"
                >
                  <Square size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={zoomOut}
                  disabled={zoom <= 0.4}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 disabled:opacity-50' : 'hover:bg-gray-200 disabled:opacity-50'}`}
                  title="Zoom out"
                >
                  <ZoomOut size={18} />
                </button>
                
                <button
                  onClick={resetZoom}
                  className={`px-2 py-1 text-sm rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  title="Reset zoom"
                >
                  {Math.round(zoom * 100)}%
                </button>
                
                <button
                  onClick={zoomIn}
                  disabled={zoom >= 3}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 disabled:opacity-50' : 'hover:bg-gray-200 disabled:opacity-50'}`}
                  title="Zoom in"
                >
                  <ZoomIn size={18} />
                </button>
                
                <button
                  onClick={rotateClockwise}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  title="Rotate clockwise"
                >
                  <RotateCw size={18} />
                </button>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const modes = ['page', 'continuous', 'double'];
                    const currentIndex = modes.indexOf(viewMode);
                    const nextMode = modes[(currentIndex + 1) % modes.length];
                    setViewMode(nextMode as any);
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  title={`Current: ${viewMode} view`}
                >
                  {viewMode === 'page' ? <BookOpen size={16} /> : 
                   viewMode === 'continuous' ? <ArrowDown size={16} /> : 
                   <Columns size={16} />}
                  <span className="text-sm hidden sm:inline capitalize">{viewMode}</span>
                </button>
                
                <button
                  onClick={copyPageInfo}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  title="Copy page info"
                >
                  <Copy size={16} />
                </button>
                
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={fileName}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  title="Download PDF"
                >
                  <Download size={16} />
                  <span className="text-sm hidden sm:inline">Download</span>
                </a>
                
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  title="Open in new tab"
                >
                  <Eye size={16} />
                  <span className="text-sm hidden sm:inline">New Tab</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;