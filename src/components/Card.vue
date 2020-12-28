<template>
  <div class="card" :class="customClasses ? customClasses.split(','): ''">
    <slot name="header"></slot>
    <div class="card-content">
     <slot name="content"></slot>
    </div>
    <div class="card-actions">
     <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Card',
  props: {
    customClasses: String
  }
})
</script>
