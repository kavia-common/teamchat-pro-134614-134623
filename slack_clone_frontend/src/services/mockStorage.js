export class MockStorage {
  /**
   * Simulates uploading a file to Convex storage and returns a public URL.
   * PUBLIC_INTERFACE
   */
  async upload(file, key) {
    // In real Convex integration, upload to storage and return its URL
    // Here we use a local blob URL to simulate
    if (!file) return '';
    const blob = new Blob([await file.arrayBuffer()], { type: file.type || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    // In real world, we could persist "key" and URL mapping.
    return url;
  }
}
