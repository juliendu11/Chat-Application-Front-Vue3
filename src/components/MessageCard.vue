<template>
  <div v-if="!right" class="message-card">
    <div class="message-content">
      <div class="message-card-owner-container">
        <img
          :src="'https://eu.ui-avatars.com/api/?name=' + owner"
          :alt="owner"
        />
        <span>{{ owner }}</span>
      </div>
      <div class="message-card-text-container">
        <span class="message-card-text">{{ text }}</span>
        <span>{{ parseDate(date) }}</span>
      </div>
    </div>
  </div>

  <div v-else class="message-card message-card-me">
    <div class="message-content message-content-me">
      <div class="message-card-owner-container">
        <img
          :src="'https://eu.ui-avatars.com/api/?name=' + owner"
          :alt="owner"
        />
        <span>{{ owner }}</span>
      </div>
      <div class="message-card-text-container">
        <span class="message-card-text message-card-text-me">{{ text }}</span>
        <span>{{ parseDate(date) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  formatDateToNow,
  getTimeZone
} from '@/utils/date'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
export default defineComponent({
  name: 'Card',
  props: {
    right: {
      type: Boolean
    },
    text: {
      type: String,
      required: true
    },
    owner: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  setup () {
    const parseDate = (val: string) => {
      return formatDateToNow(val, 'en', dayjs, getTimeZone())
    }

    return {
      parseDate
    }
  }
})
</script>
