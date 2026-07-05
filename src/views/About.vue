<script setup lang="ts">
import { useRouter } from 'vue-router'
import { t } from '@/i18n'

const router = useRouter()
</script>

<template>
  <div class="flex-1 flex flex-col safe-top safe-bottom">
    <header class="px-5 pt-6 pb-3 flex items-center gap-2">
      <button class="btn-ghost !p-2" @click="router.back()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <h1 class="text-xl font-bold">{{ t('about.title') }}</h1>
    </header>

    <div class="flex-1 overflow-y-auto px-5 pb-8 space-y-5 text-sm leading-relaxed">
      <section class="card p-5">
        <h2 class="text-base font-bold mb-2">{{ t('about.whatTitle') }}</h2>
        <p class="text-slate-600 dark:text-slate-300">{{ t('about.whatBody') }}</p>
      </section>

      <section class="card p-5">
        <h2 class="text-base font-bold mb-2">{{ t('about.trainTitle') }}</h2>
        <ul class="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
          <li><b>{{ t('about.trainStability') }}</b>:{{ t('about.trainStabilityDesc') }}</li>
          <li><b>{{ t('about.trainSpan') }}</b>:{{ t('about.trainSpanDesc') }}</li>
          <li><b>{{ t('about.trainDistribution') }}</b>:{{ t('about.trainDistributionDesc') }}</li>
          <li><b>{{ t('about.trainSpeed') }}</b>:{{ t('about.trainSpeedDesc') }}</li>
        </ul>
      </section>

      <section class="card p-5">
        <h2 class="text-base font-bold mb-2">{{ t('about.refTitle') }}</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th class="text-left py-1.5">{{ t('about.refAge') }}</th>
                <th class="text-right text-emerald-500">{{ t('rating.excellent') }}</th>
                <th class="text-right text-sky-500">{{ t('rating.good') }}</th>
                <th class="text-right text-amber-500">{{ t('rating.fair') }}</th>
                <th class="text-right text-rose-500">{{ t('rating.poor') }}</th>
              </tr>
            </thead>
            <tbody class="text-slate-700 dark:text-slate-200">
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="py-1.5">{{ t('age.7-12') }}</td>
                <td class="text-right font-mono">&lt;26s</td>
                <td class="text-right font-mono">26-42s</td>
                <td class="text-right font-mono">42-50s</td>
                <td class="text-right font-mono">&gt;50s</td>
              </tr>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="py-1.5">{{ t('age.12-17') }}</td>
                <td class="text-right font-mono">&lt;16s</td>
                <td class="text-right font-mono">16-26s</td>
                <td class="text-right font-mono">26-36s</td>
                <td class="text-right font-mono">&gt;36s</td>
              </tr>
              <tr>
                <td class="py-1.5">{{ t('age.18+') }}</td>
                <td class="text-right font-mono">&lt;8s</td>
                <td class="text-right font-mono">8-20s</td>
                <td class="text-right font-mono">20-30s</td>
                <td class="text-right font-mono">&gt;30s</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">{{ t('about.refNote') }}</p>
      </section>

      <section class="card p-5">
        <h2 class="text-base font-bold mb-2">{{ t('about.tipTitle') }}</h2>
        <ul class="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
          <li>{{ t('about.tip1') }}</li>
          <li>{{ t('about.tip2') }}</li>
          <li>{{ t('about.tip3') }}</li>
          <li>{{ t('about.tip4') }}</li>
          <li>{{ t('about.tip5') }}</li>
        </ul>
      </section>

      <section class="card p-5">
        <h2 class="text-base font-bold mb-2">{{ t('about.platformTitle') }}</h2>
        <p class="text-slate-600 dark:text-slate-300">{{ t('about.platformBody') }}</p>
      </section>

      <p class="text-center text-xs text-slate-400 pt-4">{{ t('about.footer') }}</p>
    </div>
  </div>
</template>

