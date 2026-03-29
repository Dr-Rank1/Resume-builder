// ============================================
// TEMPLATE SYSTEM - MAIN INDEX
// Scalable multi-template system for resume builder
// ============================================

// Export the complete template system
export * from './template-registry';
export * from './blocks';
export * from './template-gallery';

// Re-export template types
export type { TemplateConfig, TemplateId } from './template-registry';

// Default export for convenience
export { TemplateGallery, TemplateSelector } from './template-gallery';
export { TemplateRenderer, useTemplateSystem } from './template-registry';