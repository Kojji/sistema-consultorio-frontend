<template>
  <q-layout view="lHh Lpr lFr">
    <div class="q-col-gutter-md row">
      <div class="absolute-center bg-white">
        <div class="text-center">
          <q-spinner color="primary" size="4em" />
          <h4 style="margin: 10px">Cadastra-Re</h4>
          <p class="text-body1">
            Carregando...
          </p>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
export default {
  name: 'loadingPage'
}
</script>
