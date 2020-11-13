<template>
    <div class="demo">
        <div class="item">
            <span>下拉框：</span>
            <dropDownMenu :items="items" :selectedItem.sync="selectedItem" @change="change" />
        </div>
        <div class="item">
            <span>复选框：</span>
            <checkBox :checked.sync="isChecked" />
            <!-- <dropDownMenu :items="items" :selectedItem.sync="selectedItem" @change="change" /> -->
        </div>
        <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    </div>
</template>
<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator';
import { SItem } from '@/api/types.ts'
import HelloWorld from '@/components/HelloWorld.vue';
import dropDownMenu from '@/components/dropDownMenu/dropDownMenu.vue';
import checkBox from '@/components/checkBox/checkBox.vue';

interface statusMap {
    [key: number]: number;
}

const items: SItem[] = [{
    name: '全部状态',
    value: '',
}, {
    name: '已启用',
    value: '0',
}, {
    name: '已停用',
    value: '-1',
}]

@Component({
    components: {
        HelloWorld,
        dropDownMenu,
        checkBox
    },
})
export default class Demo extends Vue {

    private items: SItem[] = items;

    private isChecked:boolean = false;

    private selectedItem: SItem = {
        name: '全部状态',
        value: '',
    };

    private change (){
        console.log(this.selectedItem);
    }
}
</script>
<style scoped>
.demo {
    height: 100%;
}
</style>