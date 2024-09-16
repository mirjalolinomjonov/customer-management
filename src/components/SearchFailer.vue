<template>
  <div class="failer">
    <figure class="failer__img">
      <img class="mx-auto" src="@/assets/images/search1.png" alt="search failer" />
    </figure>
    <h1 class="failer__title">Maʼlumot topilmadi</h1>
    <p class="failer__subtitle">Sizning so‘rovingiz bo‘yicha xech qanday maʼlumot topilmadi</p>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.failer {
  padding: 3rem 0;
  text-align: center;

  // failer__img
  &__img img {
    user-select: none;
    pointer-events: none;
  }

  // failer__title
  &__title {
    font-weight: 700;
    font-size: 28px;
    line-height: 130%;
    color: #26292e;
    margin-bottom: 8px;
  }

  // failer__subtitle
  &__subtitle {
    font-size: 16px;
    line-height: 130%;
    color: #79838e;
  }
}
</style>
