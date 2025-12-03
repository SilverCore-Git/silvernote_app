<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import './image-upload-node.scss'

// === Types ===
interface FileItem {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  url?: string
  abortController?: AbortController
}


// === Props ===
const props = defineProps(nodeViewProps)
const extension = props.extension
const inputRef = ref<HTMLInputElement | null>(null)

// === Upload management ===
const fileItems = reactive<FileItem[]>([])

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

async function uploadFile(file: File): Promise<string | null> {
  if (file.size > props.node.attrs.maxSize) {
    const error = new Error(`File size exceeds maximum allowed (${props.node.attrs.maxSize / 1024 / 1024}MB)`)
    extension.options.onError?.(error)
    return null
  }

  const abortController = new AbortController()
  const id = crypto.randomUUID()
  const newItem: FileItem = { id, file, progress: 0, status: 'uploading', abortController }
  fileItems.push(newItem)

  try {
    const url = await extension.options.upload?.(file, (event: any) => {
      const item = fileItems.find(f => f.id === id)
      if (item) item.progress = event.progress
    }, abortController.signal)

    if (!url) throw new Error('Upload failed: no URL returned')

    if (!abortController.signal.aborted) {
      const item = fileItems.find(f => f.id === id)
      if (item) {
        item.status = 'success'
        item.url = url
        item.progress = 100
      }
      extension.options.onSuccess?.(url)
      return url
    }

    return null
  } catch (err) {
    const item = fileItems.find(f => f.id === id)
    if (item) {
      item.status = 'error'
      item.progress = 0
    }
    extension.options.onError?.(err instanceof Error ? err : new Error('Upload failed'))
    return null
  }
}

async function uploadFiles(files: File[]) {
  if (!files.length) return
  if (files.length > props.node.attrs.limit) {
    extension.options.onError?.(new Error(`Maximum ${props.node.attrs.limit} files allowed`))
    return
  }

  const urls = await Promise.all(files.map(uploadFile))
  const validUrls = urls.filter((url): url is string => url != null)
  if (!validUrls.length) return

  // Insert nodes
  const pos = props.getPos()
  if (pos == null) return

  const nodes = validUrls.map((url, i) => ({
    type: extension.options.type,
    attrs: { ...extension.options, src: url, alt: files[i]?.name ?? 'unknown', title: files[i]?.name ?? 'unknown' }
  }))

  props.editor.chain().focus()
    .deleteRange({ from: pos, to: pos + props.node.nodeSize })
    .insertContentAt(pos, nodes)
    .run()
}

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files?.length) {
    extension.options.onError?.(new Error('No file selected'))
    return
  }
  uploadFiles(Array.from(target.files))
}

function handleClick() {
  if (inputRef.value && !fileItems.length) {
    inputRef.value.value = ''
    inputRef.value.click()
  }
}

function removeFileItem(id: string) {
  const idx = fileItems.findIndex(f => f.id === id)
  if (idx !== -1) {
    const f = fileItems[idx]
    f.abortController?.abort()
    if (f.url) URL.revokeObjectURL(f.url)
    fileItems.splice(idx, 1)
  }
}

function clearAllFiles() {
  fileItems.forEach(f => { f.abortController?.abort(); if (f.url) URL.revokeObjectURL(f.url) })
  fileItems.splice(0)
}

// === Drag & Drop area ===
const isDragActive = ref(false)
const isDragOver = ref(false)

function handleDragEnter(e: DragEvent) { e.preventDefault(); e.stopPropagation(); isDragActive.value = true }
function handleDragLeave(e: DragEvent) { e.preventDefault(); e.stopPropagation(); isDragActive.value = false; isDragOver.value = false }
function handleDragOver(e: DragEvent) { e.preventDefault(); e.stopPropagation(); isDragOver.value = true }
function handleDrop(e: DragEvent) { e.preventDefault(); e.stopPropagation(); isDragActive.value = false; isDragOver.value = false; if (e.dataTransfer?.files.length) uploadFiles(Array.from(e.dataTransfer.files)) }

</script>

<template>
  <NodeViewWrapper class="tiptap-image-upload " @click="handleClick" tabindex="0">
    <div v-if="!fileItems.length"
         class="tiptap-image-upload-drag-area"
         :class="{ 'drag-active': isDragActive, 'drag-over': isDragOver }"
         @dragenter="handleDragEnter"
         @dragleave="handleDragLeave"
         @dragover="handleDragOver"
         @drop="handleDrop">
      <div class="tiptap-image-upload-dropzone ">
        <p>Cliquez ou glisser déposer pour téléverser</p>
        <small class="text-center">Max {{props.node.attrs.limit}} fichier(s), {{props.node.attrs.maxSize / 1024 / 1024}}MB chacun</small>
      </div>
    </div>

    <div v-else class="tiptap-image-upload-previews">
      <div v-for="item in fileItems" :key="item.id" class="tiptap-image-upload-preview flex flex-col">
        <span>{{ item.file.name }} ({{ formatFileSize(item.file.size) }})</span>
        <span v-if="item.status === 'uploading'">{{ item.progress }}%</span>
        <button class="primary danger max-w-40" @click.stop="removeFileItem(item.id)">Supprimer</button>
      </div>
      <button v-if="fileItems.length > 1" @click.stop="clearAllFiles">Clear All</button>
    </div>

    <input
      ref="inputRef"
      type="file"
      :accept="props.node.attrs.accept"
      :multiple="props.node.attrs.limit > 1"
      @change="handleChange"
      @click.stop
      hidden
    />
  </NodeViewWrapper>
</template>
