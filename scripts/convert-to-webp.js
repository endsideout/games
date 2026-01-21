import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  // Image quality (1-100, higher = better quality but larger file)
  quality: 80,
  
  // Maximum dimensions (set to null to keep original size)
  maxWidth: null,  // e.g., 1920 for large images
  maxHeight: null, // e.g., 1080 for large images
  
  // Whether to replace original files or create new .webp files alongside
  replaceOriginals: false,
  
  // Source directory
  sourceDir: join(__dirname, '../src/assets/images'),
  
  // Supported formats
  supportedFormats: ['.jpg', '.jpeg', '.png'],
};

// Statistics
const stats = {
  total: 0,
  converted: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  newSize: 0,
};

/**
 * Get file size in bytes
 */
async function getFileSize(filePath) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.size;
  } catch {
    return 0;
  }
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Convert image to WebP
 */
async function convertToWebP(inputPath, outputPath, originalSize) {
  try {
    let sharpInstance = sharp(inputPath);
    
    // Apply resizing if max dimensions are set
    const metadata = await sharpInstance.metadata();
    let needsResize = false;
    let newWidth = metadata.width;
    let newHeight = metadata.height;
    
    if (CONFIG.maxWidth && metadata.width > CONFIG.maxWidth) {
      newWidth = CONFIG.maxWidth;
      needsResize = true;
    }
    
    if (CONFIG.maxHeight && metadata.height > CONFIG.maxHeight) {
      newHeight = CONFIG.maxHeight;
      needsResize = true;
    }
    
    if (needsResize) {
      sharpInstance = sharpInstance.resize(newWidth, newHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }
    
    // Convert to WebP
    await sharpInstance
      .webp({ quality: CONFIG.quality })
      .toFile(outputPath);
    
    const newSize = await getFileSize(outputPath);
    const savings = originalSize - newSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);
    
    stats.converted++;
    stats.originalSize += originalSize;
    stats.newSize += newSize;
    
    return {
      success: true,
      originalSize,
      newSize,
      savings,
      savingsPercent,
      resized: needsResize,
      newDimensions: needsResize ? `${newWidth}x${newHeight}` : null,
    };
  } catch (error) {
    stats.errors++;
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Process a single file
 */
async function processFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  
  if (!CONFIG.supportedFormats.includes(ext)) {
    return;
  }
  
  stats.total++;
  
  const originalSize = await getFileSize(filePath);
  const outputPath = CONFIG.replaceOriginals
    ? filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    : filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  // Ensure output directory exists
  const outputDir = dirname(outputPath);
  await mkdir(outputDir, { recursive: true });
  
  console.log(`\n📸 Processing: ${filePath}`);
  console.log(`   Original size: ${formatBytes(originalSize)}`);
  
  const result = await convertToWebP(filePath, outputPath, originalSize);
  
  if (result.success) {
    console.log(`   ✅ Converted: ${outputPath}`);
    console.log(`   New size: ${formatBytes(result.newSize)}`);
    console.log(`   Savings: ${formatBytes(result.savings)} (${result.savingsPercent}%)`);
    if (result.resized) {
      console.log(`   Resized to: ${result.newDimensions}`);
    }
    
    // If replacing originals, delete the original file
    if (CONFIG.replaceOriginals && filePath !== outputPath) {
      try {
        await import('fs/promises').then(fs => fs.unlink(filePath));
        console.log(`   🗑️  Removed original: ${filePath}`);
      } catch (error) {
        console.log(`   ⚠️  Could not remove original: ${error.message}`);
      }
    }
  } else {
    console.log(`   ❌ Error: ${result.error}`);
  }
}

/**
 * Recursively find all image files
 */
async function findImageFiles(dir) {
  const files = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await findImageFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (CONFIG.supportedFormats.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting WebP conversion...\n');
  console.log('Configuration:');
  console.log(`  Quality: ${CONFIG.quality}%`);
  console.log(`  Max dimensions: ${CONFIG.maxWidth || 'none'}x${CONFIG.maxHeight || 'none'}`);
  console.log(`  Replace originals: ${CONFIG.replaceOriginals ? 'Yes' : 'No'}`);
  console.log(`  Source directory: ${CONFIG.sourceDir}\n`);
  
  const imageFiles = await findImageFiles(CONFIG.sourceDir);
  
  if (imageFiles.length === 0) {
    console.log('❌ No image files found to convert.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} image file(s) to process.\n`);
  
  // Process files sequentially to avoid overwhelming the system
  for (const file of imageFiles) {
    await processFile(file);
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Conversion Summary');
  console.log('='.repeat(60));
  console.log(`Total files found: ${stats.total}`);
  console.log(`Successfully converted: ${stats.converted}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`\nTotal original size: ${formatBytes(stats.originalSize)}`);
  console.log(`Total new size: ${formatBytes(stats.newSize)}`);
  console.log(`Total savings: ${formatBytes(stats.originalSize - stats.newSize)}`);
  if (stats.originalSize > 0) {
    const totalSavingsPercent = (((stats.originalSize - stats.newSize) / stats.originalSize) * 100).toFixed(1);
    console.log(`Savings percentage: ${totalSavingsPercent}%`);
  }
  console.log('='.repeat(60));
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
