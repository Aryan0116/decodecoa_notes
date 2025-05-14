import React, { useState, useEffect, useRef } from 'react';
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
  Menu
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string;
  fileName?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, fileName }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'page' | 'continuous'>('page');
  const [darkMode, setDarkMode] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

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
        toast({
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        });
      });
    } else {
      document.exitFullscreen();
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    toast({
      title: "Document loaded successfully",
      description: `Loaded ${numPages} pages`,
    });
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setLoading(false);
    toast({
      title: "Error loading document",
      description: "Could not load the PDF file. Please try again later.",
      variant: "destructive",
    });
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
    setZoom(prev => Math.max(prev - 0.2, 0.6));
  }

  function rotateClockwise() {
    setRotation(prev => (prev + 90) % 360);
  }

  function handleSearch() {
    if (searchText.trim() === '') {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Search",
      description: `Searching for: ${searchText}`,
    });
    // In a real implementation, this would integrate with PDF.js search functionality
  }

  function jumpToPage(e: React.ChangeEvent<HTMLInputElement>) {
    const pageNum = parseInt(e.target.value);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= (numPages || 1)) {
      setPageNumber(pageNum);
    }
  }

  // Generate page array for continuous mode
  const renderPages = () => {
    if (!numPages) return null;
    
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <motion.div 
          key={`page-${i}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="mb-4"
        >
          <Page
            pageNumber={i}
            renderTextLayer={false}
            className={`shadow-lg ${darkMode ? 'invert' : ''}`}
            scale={zoom}
            rotate={rotation}
          />
          <div className="text-center text-sm mt-2 text-gray-500">Page {i} of {numPages}</div>
        </motion.div>
      );
    }
    return pages;
  };

  return (
    <motion.div
      ref={containerRef}
      className={`flex flex-col ${isFullscreen ? 'h-screen' : 'h-full'} ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Toolbar */}
      <motion.div 
        className={`p-2 flex justify-between items-center border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} rounded-t-lg`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-md mr-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Menu size={18} />
          </button>
          <h3 className="text-sm font-medium truncate max-w-xs">
            {fileName || "Document.pdf"}
          </h3>
        </div>
        
        <div className="flex items-center gap-1">
          {/* <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center"
              >
                <input 
                  type="text" 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className={`px-2 py-1 text-sm rounded-md mr-1 w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border`}
                  placeholder="Search..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence> */}
          
          {/* <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
           */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            aria-label={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </motion.div>

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} overflow-auto`}
            >
              <div className="p-4">
                <h3 className="font-medium mb-3">Document Outline</h3>
                <div className="space-y-2">
                  {numPages && Array.from(Array(numPages).keys()).map((i) => (
                    <button
                      key={i}
                      onClick={() => setPageNumber(i + 1)}
                      className={`block w-full text-left px-3 py-2 rounded ${pageNumber === i + 1 ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      Page {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div 
            ref={viewerRef}
            className={`flex-1 overflow-auto p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
          >
            {loading && (
              <div className="flex justify-center items-center h-full">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
                  <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center">
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                className="flex flex-col items-center"
              >
                {viewMode === 'page' ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`page-${pageNumber}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="shadow-xl"
                    >
                      <Page
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        className={`${darkMode ? 'invert' : ''}`}
                        scale={zoom}
                        rotate={rotation}
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="space-y-6">
                    {renderPages()}
                  </div>
                )}
              </Document>
            </div>
          </div>

          {/* Bottom Toolbar */}
          <motion.div 
            className={`p-2 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} rounded-b-lg`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1 || viewMode === 'continuous'}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 disabled:opacity-50' : 'hover:bg-gray-200 disabled:opacity-50'}`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {viewMode === 'page' && (
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
                )}
                
                <button
                  onClick={goToNextPage}
                  disabled={pageNumber >= (numPages || 1) || viewMode === 'continuous'}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 disabled:opacity-50' : 'hover:bg-gray-200 disabled:opacity-50'}`}
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={zoomOut}
                  disabled={zoom <= 0.6}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 disabled:opacity-50' : 'hover:bg-gray-200 disabled:opacity-50'}`}
                  aria-label="Zoom out"
                >
                  <ZoomOut size={18} />
                </button>
                
                <span className="text-sm px-1">{Math.round(zoom * 100)}%</span>
                
                <button
                  onClick={zoomIn}
                  disabled={zoom >= 3}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 disabled:opacity-50' : 'hover:bg-gray-200 disabled:opacity-50'}`}
                  aria-label="Zoom in"
                >
                  <ZoomIn size={18} />
                </button>
                
                <button
                  onClick={rotateClockwise}
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  aria-label="Rotate clockwise"
                >
                  <RotateCw size={18} />
                </button>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode(viewMode === 'page' ? 'continuous' : 'page')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  {viewMode === 'page' ? (
                    <>
                      <Columns size={16} />
                      <span className="text-sm hidden sm:inline">Continuous</span>
                    </>
                  ) : (
                    <>
                      <BookOpen size={16} />
                      <span className="text-sm hidden sm:inline">Page View</span>
                    </>
                  )}
                </button>
                
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={fileName || "document.pdf"}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <Download size={16} />
                  <span className="text-sm hidden sm:inline">Download</span>
                </a>
                
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <Eye size={16} />
                  <span className="text-sm hidden sm:inline">New Tab</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PDFViewer;