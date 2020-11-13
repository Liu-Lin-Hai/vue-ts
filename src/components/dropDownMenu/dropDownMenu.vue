<template>
    <div class="dropDownMenu" :class="[`${menuColor}`, { 'opened': menuOpened, 'disabled': disabled }]" :style="{ width: dropDownWidth + dropDownWidthUnit }">
        <span :title="showText" @click="openAndClose()" class="select_item" :class="{ is_not_placeholder: showText != placeholder }" v-text="showText"></span>
        <span @click="openAndClose" class="iconfont iconxiaosanjiao iconme_setting_arrowxia"></span>
        <ul class="menu" :class="{ fixed: fixed, hasCheckBox: hasCheckBox, crosswise: crosswise }">
            <li v-if="hasFilterBar" class="filter_bar">
                <input v-model="filterWord" class="form-control" type="" name="">
            </li>
            <li v-if="hasCheckBox && filterItems.length > 0" @click="selectAll" class="common_li" :class="{ hasCheckBox: hasCheckBox,selected:isSelectedAll() }">
                <checkBox :checked="isSelectedAll()"></checkBox>
                <span class="li_name">全部</span>
            </li>
            <li @click="selectItem($event, item)" :class="{ selected: isSelected(item).flag, hasCheckBox: hasCheckBox, crosswise: crosswise, hidden: hidden && hasCheckBox }" class="common_li" v-for="(item) in filterItems" :key="item[value]">
                <span v-if="!hasCheckBox" class="selected_icon iconfont icongou1"></span>
                <checkBox :checked="isSelected(item).flag" v-if="hasCheckBox"></checkBox>
                <span class="li_name" v-text="item[name]"></span>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import { Vue, Provide, Component, Prop, Watch } from "vue-property-decorator";
import { SItem } from "@/api/types.ts";

declare var $: any;

interface flagConfig {
    flag ? : boolean;
    index ? : number | string;
    [propName: string]: any;
}

@Component({
    name: "dropDownMenu",
})
export default class dropDownMenu extends Vue {
    @Prop({ default: false }) private fixed!: boolean;
    @Prop({ default: "name" }) private name!: string;
    @Prop({ default: "value" }) private value!: string;
    @Prop({ required: false }) private selectedItem!: SItem;
    @Prop({ required: false, default: () => [] }) private selectedItems!: SItem[];
    @Prop({ required: true }) private items!: SItem[];
    @Prop({ default: "请选择" }) private placeholder!: string;
    @Prop({ default: false }) private hasCheckBox!: boolean;
    @Prop({ default: false }) private hasFilterBar!: boolean;
    @Prop({ default: "" }) private unit!: string;
    @Prop({ default: false }) private isButton!: boolean;
    @Prop({ default: false }) private crosswise!: boolean;
    @Prop({ default: false }) private hidden!: boolean;
    @Prop({ default: false }) private disabled!: boolean;
    @Prop({ default: 118 }) private dropDownWidth!: number;
    @Prop({ default: "px" }) private dropDownWidthUnit!: string;
    @Prop({ default: false }) private menuColor!: boolean;
    @Prop({ default: false }) private directionTop!: boolean;

    mounted() {
        this.initBlur();
        this.initScroll();
    }

    destroyed() {
        window.removeEventListener("click", this.blurEvent); //销毁失焦事件
        window.removeEventListener("mousewheel", this.scroll); //销毁滚动事件
    }

    private menuOpened: boolean = false;
    private filterWord: string = "";
    private blurEvent: any;
    private scroll: any;

    public get showText() {
        if (this.hasCheckBox) {
            if (this.selectedItems.length === 0) return this.placeholder;
            return this.selectedItems.map((value, index) => {
                return value[this.name]
            }).join("、");
        } else {
            return this.selectedItem[this.name] ? this.selectedItem[this.name] + this.unit : this.placeholder;
        }
    }

    public get filterItems() {
        let self = this;
        let items = this.items.filter((value) => {
            return value[self.name].indexOf(self.filterWord) >= 0;
        })
        return items;
    }

    /**
     * [openAndClose 点击下拉的动作]
     * @param {[type]} $event [description]
     */
    private openAndClose($event: HTMLElement) {
        if (this.disabled) {
            return;
        }
        this.menuOpened = !this.menuOpened;
        if (this.menuOpened) {
            this.initFix();
            this.fixPosition();
        }
    }

    /**
     * [initBlur 初始化失焦事件]
     */
    private initBlur() {
        let self = this;
        this.blurEvent = function(event: Event) {
            let $target = $(event.target);
            if (self.menuOpened && $target.parents(".dropDownMenu")[0] !== self.$el && $target[0] !== self.$el) {
                self.menuOpened = false;
            }
        };
        window.addEventListener("click", this.blurEvent);
    }

    /**
     * [initScroll 初始化滚动关闭事件]
     */
    private initScroll() {
        let self = this;
        this.scroll = function(event: Event) {
            let $target = $(event.target);
            if (self.menuOpened && $target.parents(".dropDownMenu")[0] !== self.$el && $target[0] !== self.$el) {
                self.menuOpened = false;
            }
        };
        window.addEventListener("mousewheel", this.scroll)
    }

    /**
     * [selectItem 选中选项]
     * @param {[type]} $event [点击事件]
     * @param {[type]} item   [选中项]
     */
    private selectItem($event: Event, item: SItem) {
        //$event.stopPropagation();
        if (this.isButton) {
            this.menuOpened = false;
            this.$emit('change', item);
        } else {
            if (this.hasCheckBox) {
                let selectedInfo: flagConfig = this.isSelected(item);
                if (selectedInfo.flag) {
                    (this.selectedItems as flagConfig).splice(selectedInfo.index, 1);
                } else {
                    this.selectedItems.push(item);
                }
            } else {
                this.$emit("update:selectedItem", item);
                this.menuOpened = false;
            }
            this.$emit('change', $event);
        }
    }

    /**
     * [isSelected 选项是否选中]
     * @param {[type]} item [description]
     */
    private isSelected(item: SItem) {
        if (this.hasCheckBox) {
            for (let i in this.selectedItems) {
                let thisItem = this.selectedItems[i];
                if (item[this.value] === thisItem[this.value]) {
                    return { flag: true, index: i };
                }
            }
            return {
                flag: false
            };
        } else {
            return { flag: item[this.value] === this.selectedItem[this.value] };
        }
    }

    /**
     * [initFix 初始化fix定位下的下拉菜单位置]
     */
    private initFix() {
        if (!this.fixed) return;
        let elHeight = (this.$el as HTMLElement).offsetHeight;
        let top = $(this.$el).offset().top - $(document).scrollTop();
        let left = $(this.$el).offset().left;
        let width = (this.$el as HTMLElement).offsetWidth;
        let $menu = $(this.$el).find(".menu");
        $menu.css({
            'min-width': '116px',
            top: top + elHeight,
            left: left
        });
    }

    /**
     * [fixPosition 修复菜单位置]
     */
    private fixPosition() {
        let self = this;
        setTimeout(() => {
            let $menu = $(self.$el).find(".menu");
            let elHeight = (self.$el as HTMLElement).offsetHeight;
            let menuTop = $menu.offset().top;
            let menuHeight = $menu[0].offsetHeight;
            let winHeight = document.body.offsetHeight;
            if (self.directionTop) {
                $menu.css("top", -(menuHeight + 2));
                return;
            }
            // if (winHeight >= (menuTop + menuHeight)) return;
            if ((winHeight - (elHeight + $(self.$el).offset().top - $(document).scrollTop())) > menuHeight) return; //元素到浏览器底部的高度与展开下拉信息高度对比
            if (!self.fixed) {
                $menu.css("top", -(menuHeight + 2));
            } else if (self.fixed) {
                $menu.offset({ top: menuTop - menuHeight - elHeight });
            }
        }, 100);
    }

    @Watch('selectedItems')
    private onSelectedItemsChange(val: SItem, oldVal: SItem) {
        if (JSON.stringify(val) == JSON.stringify(oldVal)) return;
        this.$emit("update:selectedItems", val);
    }

    @Watch('menuOpened')
    private onMenuOpened(val: boolean, oldVal: boolean) {
        if (!val) {
            $(this.$el).find(".menu").removeAttr("style");
            this.filterWord = "";
        }
    }

}
</script>
<style lang="less" scoped>
.dropDownMenu {
    width: 118px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    padding-left: 7px;
    cursor: pointer;
    padding-right: 20px;
    position: relative;
    top: 0px;
    box-sizing: border-box;
    vertical-align: middle;
    border-radius: 2px;
    border: 1px solid #e9ecef;
    box-sizing: border-box;

    .select_item {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        display: inline-block;
        white-space: nowrap;
        font-size: 14px;
        font-weight: 400;
        color: #333333;

        &.is_not_placeholder {
            //color: #fff;
        }
    }

    .iconxiaosanjiao {
        position: absolute;
        top: -1px;
        font-size: 12px;
        right: 8px;
        color: #7e89a9;
        transform: scale(0.6);
        transition: transform 0.3s;
    }

    &.disabled {
        background: #e3e3e366;
        cursor: not-allowed;

        .select_item {
            color: #bab4b4;
        }

        .iconxiaosanjiao {
            display: none;
        }

        &:hover {
            border: 1px solid #414459;
        }
    }

    &:hover {
        border: 1px solid #55a8fd;
    }

    &.opened {
        border: 1px solid #55a8fd;

        .iconxiaosanjiao {
            transform: rotate(180deg) scale(0.6);
        }

        .menu {
            height: initial;
            z-index: 99;
            border: 1px solid #55a8fd;

            .li_name {
                display: block;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                // border-bottom: 1px solid #424757;
                height: 34px;
                box-sizing: border-box;
                min-width: 100%;
            }
        }
    }

    /*展开的菜单*/
    .menu {
        position: absolute;
        left: -1px;
        top: 36px;
        width: auto; //100%;
        min-width: calc(100% + 2px);
        max-height: 170px;
        max-width: 120px;
        height: 0px;
        overflow: auto;
        background: #fff;
        border-radius: 2px;

        &.isScroll {
            overflow: scroll;
        }

        &.hasCheckBox.crosswise {
            width: 250px;
        }

        .filter_bar {
            width: 100%;
            height: initial;
            line-height: initial;
            background: white;
            padding: 10px 10px;
            margin: initial;
            box-sizing: border-box;

            input {
                width: 100%;
            }
        }

        .common_li {
            padding-left: 10px;
            padding-top: 0;
            padding-bottom: 0;
            padding-right: 10px;
            font-size: 14px;
            height: 34px;
            line-height: 34px;
            cursor: pointer;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            display: flex;
            align-items: center;

            &:hover {
                background: #f2f8fe;
            }

            &.hasCheckBox.crosswise {
                float: left;
                width: 71px;
            }

            &.hidden {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            &:last-child {
                .li_name {
                    border-bottom: none !important;
                }
            }

            &:hover:not(.hasCheckBox) {
                //background: #4D89FF;
                //color: #fff;
            }

            .selected_icon {
                width: 0px;
                height: 34px;
                line-height: 34px;
                display: inline-block;
                opacity: 0;
                filter: alpha(opacity=0);
                float: left;
                text-align: center;
            }

            &.selected {

                //background: #4D89FF;
                .li_name {
                    color: #0f549b;
                }

                .selected_icon {
                    opacity: 1;
                    filter: alpha(opacity=100);
                    font-size: 16px;
                    color: #fff;
                    background: #4d89ff;
                }
            }
        }

        &.fixed {
            position: fixed;
        }
    }
}
</style>