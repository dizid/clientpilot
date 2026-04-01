import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveProfile as apiSaveProfile, getProfile as apiGetProfile, type UserProfile } from '@/lib/api'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<UserProfile>({
    headline: '',
    bio: '',
    skills: [],
    tech_stack: [],
    experience_years: 0,
    projects: [],
    social_links: {},
    target_market: '',
    pricing_model: '',
    availability: ''
  })
  const loaded = ref(false)
  const saving = ref(false)

  async function load() {
    try {
      const { data } = await apiGetProfile()
      if (data.profile) {
        profile.value = data.profile
      }
      loaded.value = true
    } catch {
      loaded.value = true
    }
  }

  async function save() {
    saving.value = true
    try {
      await apiSaveProfile(profile.value)
    } finally {
      saving.value = false
    }
  }

  return { profile, loaded, saving, load, save }
})
