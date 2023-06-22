# Migration to script setup syntax

1. **Add setup to the script tag**

2. **make use of defineProps and withDefault when necessary**: In a regular Composition API setup, the props are available as arguments to the setup() function. In the script setup format, you need to define them using the defineProps() functions. If props are not used in the script tags, you can omit the declaration of the variable and just use the defineProps() function. If you have props with default values, you'll use the withDefaults method. The withDefaults method takes two arguments: the first is the defineProps() function, and the second is an object with the default values for the props.

3. **Remove the setup() function**: The script setup format doesn't require a setup() function. You'll directly write your Composition API code within the `<script>` tag. In the script setup format, there's no need for a return statement. Instead, you directly write your Composition API code inside the `<script>` tag.

4. **Use withDefaults for default prop values**: If you have props with default values, you'll use the withDefaults method.

5. **Use defineEmits for emitting events**: In a regular Composition API setup, emit are part of the context argument. In the script setup format, you'll use the defineEmits() function to declare the events that the component can emit. The defineEmits() function takes an array of strings as an argument. Each string is the name of an event that the component can emit. If you don't have any events to emit, you can omit the declaration of the emit variable and just use the defineEmits() function.

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

### Before

```vue
<template>
  <header @click="emit('click')">
    <h1>{{ title }}</h1>
  </header>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "ParentComponent",
  props: {
    title: {
      type: String,
      default: "default title",
    },
  },
  setup(_, { emit }) {
    return {
      emit,
    };
  },
});
</script>
```

### After

```vue
<template>
  <header @click="emit('click')">
    <h1>{{ title }}</h1>
  </header>
</template>
<script setup lang="ts">
import { computed, defineComponent } from "vue";

interface Props {
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: "default title",
});

defineEmits(["click"]);
</script>
```
