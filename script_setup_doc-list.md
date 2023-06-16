# Migration to script setup syntax

1. **Add setup to the script tag**

2. **make use of defineProps, defineEmits And withDefault when necessary**: In a regular Composition API setup, the props and emits are available as arguments to the setup() function. In the script setup format, you need to define them using the defineProps() and defineEmits() functions. If props are not used in the script tags, you can omit the declaration of the variable and just use the defineProps() function. If you have props with default values, you'll use the withDefaults method. The withDefaults method takes two arguments: the first is the defineProps() function, and the second is an object with the default values for the props. In the case we use emit on the setup() now we need to declare a variable with the defineEmits() function.

3. **Remove the setup() function**: The script setup format doesn't require a setup() function. You'll directly write your Composition API code within the `<script>` tag. In the script setup format, there's no need for a return statement. Instead, you directly write your Composition API code inside the `<script>` tag.

4. **Use withDefaults for default prop values**: If you have props with default values, you'll use the withDefaults method.

## Migration example 1

### Before

```vue
<template>
  <div @click="handleClick">
    <h1>{{ title }}</h1>
    <p>{{ formattedContent }}</p>
    <p>{{ formatCurrency(10_000) }}</p>
    <DComponent />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { DComponent } from "@/components";
import { formatNumberKNotation } from "@/utils";

export default defineComponent({
  name: "ParentComponent",
  components: {
    DComponent,
  },
  props: {
    title: {
      type: String,
      default: "default title",
    },
    content: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const handleClick = () => {
      emit("click");
    };

    const formattedContent = computed(() => {
      return props.content
        .split(". ")
        .map((sentence) => {
          return sentence.charAt(0).toUpperCase() + sentence.slice(1);
        })
        .join(". ");
    });

    return {
      formattedContent,
      handleClick,
      formatCurrency: formatCurrencyKNotation,
    };
  },
});
</script>
```

### After

```vue
<template>
  <div @click="handleClick">
    <h1>{{ title }}</h1>
    <p>{{ formattedContent }}</p>
    <p>{{ formatCurrency(10_000) }}</p>
    <DComponent />
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { DComponent } from "@/components";
import { formatNumberKNotation } from "@/utils";

interface Props {
  title?: string;
  content: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "default title",
});

const emit = defineEmits(["click"]);

const formattedContent = computed(() => {
  return props.content
    .split(". ")
    .map((sentence) => {
      return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    })
    .join(". ");
});

const formatCurrency = formatNumberKNotation;
</script>
```

## Migration example 2

### Before 2

```vue
<template>
  <header>
    <h1>{{ title }}</h1>
  </header>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "ParentComponent2",
  props: {
    title: {
      type: String,
      default: "default title",
    },
  },
  setup() {
    onMounted(() => {
      console.log("mounted");
    });
  },
});
</script>
```

### After 2

```vue
<template>
  <header>
    <h1>{{ title }}</h1>
  </header>
</template>
<script setup lang="ts">
import { computed, defineComponent, onMounted } from "vue";

interface Props {
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: "default title",
});
</script>
```
