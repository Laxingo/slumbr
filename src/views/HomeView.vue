<script setup>
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isAuthed = computed(() => auth.isAuthenticated)

function goLogin() {
  router.push('/login')
}

function goDashboard() {
  router.push('/dashboard')
}

function doLogout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="home">


    <!-- Header / Nav -->
    <header class="topbar">
      <div class="container topbar_inner">
        <RouterLink to="/" class="brand">
          <span class="brand_mark">Slumbr</span>
          <span class="brand_tag">sleep tracking</span>
        </RouterLink>

        <nav class="nav">
          <a class="nav_link" href="#features">Features</a>
          <a class="nav_link" href="#how">How it works</a>

          <div class="nav_actions">
            <button v-if="isAuthed" class="btn btn-secondary" type="button" @click="goDashboard">
              Dashboard
            </button>

            <button v-if="!isAuthed" class="btn btn-primary" type="button" @click="goLogin">
              Login
            </button>

            <button v-else class="btn btn-ghost" type="button" @click="doLogout">
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <main>
      <section class="hero">
        <div class="container hero_grid">
          <div class="hero_content">


            <h1 class="hero_title">
              Sleep better.<br />
              Track smarter.
            </h1>

            <p class="hero_subtitle">
              A calm, premium sleep journal that turns daily logs into clear trends.
            </p>

            <div class="hero_actions">
              <button v-if="!isAuthed" class="btn btn-primary btn-lg" type="button" @click="goLogin">
                Get started
              </button>

              <button v-else class="btn btn-primary btn-lg" type="button" @click="goDashboard">
                Open dashboard
              </button>

              <a class="btn btn-secondary btn-lg" href="#features">
                Explore features
              </a>
            </div>

            <div class="hero_meta">
              <div class="meta">
                <div class="meta_value">Fast</div>
                <div class="meta_label">Daily logging</div>
              </div>
              <div class="meta">
                <div class="meta_value">Clear</div>
                <div class="meta_label">Visual trends</div>
              </div>
              <div class="meta">
                <div class="meta_value">Improved</div>
                <div class="meta_label">Sleeping patterns, feel rested and energized</div>
              </div>
            </div>
          </div>



          <!-- Painel -->
          <div class="hero_panel">
            <div class="panel">
              <div class="panel_top">
                <div class="panel_dot"></div>
                <div class="panel_dot"></div>
                <div class="panel_dot"></div>
                <div class="panel_title">Preview</div>
              </div>

              <div class="panel_stats">
                <div class="stat">
                  <div class="stat_label">Avg. duration</div>
                  <div class="stat_value">7h 24m</div>
                </div>

                <div class="stat">
                  <div class="stat_label">Avg. regularity</div>
                  <div class="stat_value">High</div>
                </div>

                <div class="stat">
                  <div class="stat_label">Avg. quality</div>
                  <div class="stat_value">4 / 5</div>
                </div>

              </div>

              <div class="panel_progress">
                <div class="progress">
                  <div class="progress_label">Duration</div>
                  <div class="progress_bar">
                    <span style="width: 78%"></span>
                  </div>
                </div>

                <div class="progress">
                  <div class="progress_label">Regularity</div>
                  <div class="progress_bar">
                    <span style="width: 82%"></span>
                  </div>
                </div>

                <div class="progress">
                  <div class="progress_label">Quality</div>
                  <div class="progress_bar">
                    <span style="width: 64%"></span>
                  </div>
                </div>

              </div>

              <div class="panel_hint">
                Weekly averages built from simple daily logs.
              </div>
            </div>
          </div>
        </div>
      </section>






      <!-- Features -->
      <section id="features" class="section">
        <div class="container">
          <div class="section_head">
            <h2 class="section_title">Designed for consistent tracking</h2>
          </div>

          <div class="grid-3">
            <div class="card">
              <div class="card_icone">*icone fixe*</div>
              <h3 class="card_title">Sleep logging</h3>
              <p class="card_text">
                Log bedtime, wake time, duration, quality, interruptions and notes.
              </p>
            </div>

            <div class="card">
              <div class="card_icone">*icone fixe*</div>
              <h3 class="card_title">Trends & insights</h3>
              <p class="card_text">
                Visualize your sleep over time and spot patterns that matter.
              </p>
            </div>

            <div class="card">
              <div class="card_icone">*icone fixe*</div>
              <h3 class="card_title">Progress system</h3>
              <p class="card_text">
                Earn points by improving yourself, feel rested and energized to unlock prizes!
              </p>
            </div>
          </div>
        </div>
      </section>





      <!-- How it works -->
      <section id="how" class="section section--alt">
        <div class="container">
          <div class="section_head">
            <h2 class="section_title">How it works</h2>
          </div>

          <div class="grid-3">
            <div class="step">
              <div class="step_num">1</div>
              <h3 class="step_title">Create an account</h3>
              <p class="step_text">Sign up to start your journey.</p>
            </div>

            <div class="step">
              <div class="step_num">2</div>
              <h3 class="step_title">Log your sleep</h3>
              <p class="step_text">Add quick entries and see the results.</p>
            </div>

            <div class="step">
              <div class="step_num">3</div>
              <h3 class="step_title">Review and adjust</h3>
              <p class="step_text">See your patterns and improve your routines.</p>
            </div>
          </div>

          <div class="cta-row">
            <button v-if="!isAuthed" class="btn btn-primary btn-lg" type="button" @click="goLogin">
              Start now
            </button>

            <button v-else class="btn btn-primary btn-lg" type="button" @click="goDashboard">
              Continue
            </button>

          </div>
        </div>
      </section>
    </main>





    <!-- Footer -->
    <footer class="footer">
      <div class="container footer_inner">
        <div class="footer_left">
          <div class="footer_brand">Slumbr</div>
          <div class="footer_copy">© 2026 Slumbr. All rights reserved.</div>
        </div>

        <div class="footer_links">
          <a href="#" class="footer_link">Privacy</a>
          <a href="#" class="footer_link">Terms</a>
          <a href="#" class="footer_link">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>
