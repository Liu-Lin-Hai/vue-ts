<template>
    <div class="check_box_div" @click="check" :class="{'checked':checked,'disabled':disabled}">
        <div class="check_box">
            <span class="iconfont iconxiala-xuanzhong"></span>
        </div>
        <span v-if="name!=undefined" class="name" v-text="name"></span>
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({
    name: 'checkBox'
})

export default class checkBox extends Vue {
    @Prop({ required: true }) private checked!: boolean;
    @Prop({ required: false, default: '' }) private name!: string;
    @Prop({ required: false, default: false }) private disabled!: boolean;

    private check() {
        if (this.disabled) {
            return;
        }
        let checked = this.checked ? false : true;
        this.$emit("update:checked", checked);
        this.$emit('change');
    }
}
</script>
<style scoped lang="less">
.check_box_div {
    display: inline-flex;
    align-items: center;
    height: 15px;
    line-height: 15px;
    margin-right: 10px;
    vertical-align: middle;

    .name {
        line-height: 20px;
        padding: 0;
        cursor: pointer;
        display: inline-block;
        padding-left: 10px;
        font-size: 14px;
    }

    .check_box {
        width: 15px;
        height: 15px;
        display: inline-block;
        border-radius: 2px;
        box-sizing: border-box;
        border: 1px solid rgba(173, 173, 173, 1);
        cursor: pointer;
        position: relative;
        text-align: center;
        line-height: 20px;

        span {
            transition: transform .1s;
            -webkit-transition: transform .1s;
            -o-transition: transform .1s;
            -moz-transition: transform .1s;
            transform: scale(0, 0);
            position: absolute;
            width: 100%;
            height: 100%;
            font-size: 10px;
            left: 0;
            top: 0;
            color: #fff;
            font-size: 14px;
        }
    }

    &.checked {
        .check_box {
            border-color: #027AFF;
            background: #027AFF;

            span {
                transform: scale(.7, .7);
                display: block;

                &:before {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: -3px;
                    left: 0px;
                    display: inline-block;
                    color: #fff;
                    font-size: 14px;
                }
            }
        }
    }

    &.disabled {
        //cursor: not-allowed;

        .check_box {
            background: #F5F7FA;
            border: 1px solid #E9ECEF;
            cursor: not-allowed;
        }

        .name {
            cursor: not-allowed;
        }
    }
}
</style>