<template>
    <ui-page :title="title || page.title" :page="page" :backable="backable" ref="page">
        <div slot="drawer">
            <div class="header">
                <img class="logo" src="/static/img/earth.svg">
            </div>
            <ui-list @itemClick="toggle()">
                <ui-list-item title="地球" to="/">
                    <ui-icon slot="left" value="grade"/>
                </ui-list-item>
                <ui-list-item title="太阳系" to="/solar_system">
                    <ui-icon slot="left" value="grade"/>
                </ui-list-item>
                <ui-list-item title="数学演示" to="/math">
                    <ui-icon slot="left" value="grade"/>
                </ui-list-item>
                <!--
                     <ui-list-item title="地球月球" to="/moon">
                    <ui-icon slot="left" value="grade"/>
                </ui-list-item> -->
                <ui-list-item title="正方体" to="/cube">
                    <ui-icon slot="left" value="grade"/>
                </ui-list-item>
                <ui-list-item title="球体" to="/ball">
                    <ui-icon slot="left" value="grade"/>
                </ui-list-item>
                <ui-list-item title="我的世界（测试）" to="/world">
                    <ui-icon slot="left" value="grade"/>
                </ui-list-item>
                <ui-list-item title="Obj（测试）" to="/obj">
                    <ui-icon slot="left" value="grade"/>
                </ui-list-item>
                <ui-list-item title="关于" to="/about">
                    <ui-icon slot="left" value="grade"/>
                </ui-list-item>
            </ui-list>
        </div>
        <slot></slot>
    </ui-page>
</template>

<script>
    export default {
        data() {
            return {
                open: false,
                docked: true
            }
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: 'default'
            },
            page: {
                type: Object,
                default: function () {
                    return {
                        title: '云设'
                    }
                }
            },
            backable: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            toggle() {
                console.log(this.$refs.page)
            }
        }
    }
</script>

<style lang="scss" scoped>
.header {
    padding: 40px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.logo {
    display: block;
    width: 80px;
    margin: 0 auto;
}
.ui-position-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>

