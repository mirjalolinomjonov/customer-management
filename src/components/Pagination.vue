<template>
  <ul v-if="totalPages > 1" class="pagination">
    <li>
      <button
        class="pagination__btn"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        &lt;
      </button>
    </li>
    <li>
      <button
        v-if="!(totalPages <= 7)"
        class="pagination__btn"
        @click="changePage(1)"
        :class="{ active: currentPage === 1 }"
      >
        1
      </button>
    </li>
    <li v-if="!(totalPages <= 7) && currentPage > 3">...</li>
    <li v-for="page in pageRange" :key="page">
      <button
        class="pagination__btn"
        @click="changePage(page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
    </li>
    <li v-if="!(totalPages <= 7) && currentPage < totalPages - 2">...</li>
    <li>
      <button
        v-if="!(totalPages <= 7)"
        class="pagination__btn"
        @click="changePage(totalPages)"
        :class="{ active: currentPage === totalPages }"
      >
        {{ totalPages }}
      </button>
    </li>
    <li>
      <button
        class="pagination__btn"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        &gt;
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue'

// DATA
let currentPage = ref<number>(1)
let perPage = ref<number>(10)

// PROPS
const props = defineProps<{
  list: Array<{}>
}>()

// EMITS
const emits = defineEmits(['pagination'])

// COMPUTED
const totalPages = computed(() => {
  return Math.ceil(props.list.length / perPage.value)
})
const pageRange = computed(() => {
  const range = []

  if (totalPages.value <= 7) {
    // If pages are less than 7, display all pages
    for (let i = 1; i <= totalPages.value; i++) {
      range.push(i)
    }
  } else {
    // Display the current page and surrounding pages
    const start = Math.max(2, currentPage.value - 2)
    const end = Math.min(totalPages.value - 1, currentPage.value + 2)
    for (let i = start; i <= end; i++) {
      range.push(i)
    }
  }
  return range
})

// METHODS
function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    emits('pagination', { currentPage: currentPage.value, pager: perPage.value })
  }
}
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  gap: 5px;

  // pagination__btn
  &__btn {
    padding: 5px 10px;
    border: none;
    border-radius: 6px;
    color: white;
    background-color: #404040;
    cursor: pointer;
    outline: none;
    transition: color 0.15s ease-in-out;
    &:not(.active, [disabled]):hover {
      color: #019878;
    }
    &.active {
      background-color: #019878;
    }
    &[disabled] {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>
