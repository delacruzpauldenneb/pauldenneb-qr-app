<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-row justify="center">
          <v-col cols="12" sm="5" md="3">
            <v-card>
              <v-card-title class="text-center">
                Sign In
              </v-card-title>

              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    outlined
                    rounded
                    required
                  />

                  <v-text-field
                    v-model="password"
                    type="password"
                    label="Password"
                    outlined
                    rounded
                    required
                  />
                </v-form>
              </v-card-text>

              <v-card-actions class="flex-column">
                <v-btn
                  color="blue"
                  rounded
                  @click="submit"
                >
                  Sign In
                </v-btn>

                <div class="d-flex align-center my-2" style="width: 100%;">
                  <v-divider class="flex-grow-1"></v-divider>
                  <span class="">OR</span>
                  <v-divider class="flex-grow-1"></v-divider>
                </div>

                <v-btn 
                  color="red"
                  dark
                  rounded
                  @click="signInWithGoogle"
                >
                  <v-icon left>mdi-google</v-icon>
                  Sign in with Google
                </v-btn>
<div class="d-flex align-center my-2" style="width: 100%;">
                  <v-divider class="flex-grow-1"></v-divider>
                  <span class="">OR</span>
                  <v-divider class="flex-grow-1"></v-divider>
                </div>

                <v-btn 
                  color="blue"
                  dark
                  rounded
                  @click="signInWithDiscord"
                >
                  Sign in with Discord
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  layout: "auth",
  middleware: "guest",
  methods: {
    signInWithGoogle() {
      this.$auth.loginWith('google')
    },
    signInWithDiscord() {
      // Assuming you have a Discord OAuth setup through Firebase or another backend
      this.$auth.loginWith('discord')
        .then(() => {
          console.log('Successfully signed in with Discord');
        })
        .catch((error) => {
          console.error('Error signing in with Discord:', error);
        });
    }
  }
}
</script>

<style scoped>
</style>
