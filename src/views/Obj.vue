
<template>
    <my-page class="page-home" title="Obj（测试）" :page="page">
        <div class="earth-box" id="WebGL-output"></div>
        <div class="tool-box">
            <button @click="add">增加</button>
        </div>
        <ui-drawer right :open="settingVisible" @close="toggleSetting()">
            <ui-appbar title="设置">
                <ui-icon-button icon="close" slot="left" @click="toggleSetting" />
            </ui-appbar>
            <div class="body">
                <ui-list>
                    <!-- <ui-sub-header>声音开启设置</ui-sub-header> -->
                    <ui-list-item disableRipple @click="handleToggle('rotate')" title="旋转">
                        <ui-switch v-model="rotate" slot="right"/>
                    </ui-list-item>
                </ui-list>
            </div>
        </ui-drawer>
    </my-page>
</template>

<script>
    /* eslint-disable */
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    function lglt2xyz(longitude,latitude,radius){
        var lg = THREE.Math.degToRad(longitude) , lt = THREE.Math.degToRad(latitude);
        var y = radius * Math.sin(lt);
        var temp = radius * Math.cos(lt);
        var x = temp * Math.sin(lg);
        var z = temp * Math.cos(lg);
        // console.log(x+","+y+","+z);
        return {x:x , y:y ,z:z}
    }

    console.log(lglt2xyz(113, 24, 40))

    export default {
        data () {
            return {
                rotate: false,
                settingVisible: false,
                page: {
                    menu: [
                    ]
                }
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            handleToggle(key) {
                console.log(12)
                this[key] = !this[key]
            },
            toggleSetting() {
                this.settingVisible = !this.settingVisible
            },
            destroyed() {
                console.log(this.scene)
                this.scene.destroy()
            },
            add() {
                new THREE.OBJLoader().load('/static/tree.obj', obj => {
                    console.log('callback')
                    console.log('===obj', obj)
                    obj.position.x = 100
                    obj.position.z = 0
                    obj.position.y = 0

                    obj.scale.x = 80
                    obj.scale.y = 80
                    obj.scale.z = 80
                    this.scene.add(obj)

                    // clickObjects.push(obj);
                })
            },
            init() {
                const METRE = 2

                var scene = new THREE.Scene();
                this.scene = scene
                let rect = document.getElementById('WebGL-output').getBoundingClientRect()
                var camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.01, 1000)
                camera.position.z = 100
                camera.position.x = 80
                camera.position.y = 80


                var renderer = new THREE.WebGLRenderer({
                    antialias: true
                })
                renderer.shadowMap.enabled = true
                renderer.shadowMap.type = THREE.PCFSoftShadowMap
                renderer.shadowMapEnabled = true
                renderer.setClearColor( 0xcc9900, 1 )
                // renderer.setClearColor( 0xffffff, 1 )

                renderer.setSize( window.innerWidth, window.innerHeight );

                document.getElementById("WebGL-output").appendChild(renderer.domElement);

                // 环境光
                // scene.add(new THREE.AmbientLight(0x0099cc, 3));
                // scene.add(new THREE.AmbientLight(0xf1f1f1, 0.4));
                // scene.add(new THREE.AmbientLight(4210752, 3));
                // 平行光
                var light = new THREE.DirectionalLight(16777215, 2);
                light.position.set(0, 500, 500);
                scene.add(light);
                light.castShadow = true;
                // 坐标系
                var axes = new THREE.AxisHelper(300);
                scene.add(axes);

                let ball = createBall()
                ball.position.z = 0
                ball.position.x = 0
                ball.position.y = 0
                scene.add(ball)
                console.log('===ball', ball)
                // ball.setPosition(0, 0, 0)

                function createRect() {

                    // 平面几何图形
                    // http://threejs.outsidelook.cn/r89/source/docs/index.html?q=PlaneGeometry#Reference/Geometries/PlaneGeometry
                    let geometry = new THREE.PlaneGeometry(400, 400);

                    let material = new THREE.MeshBasicMaterial({color:0x0099cc});

                    let rect = new THREE.Mesh(geometry,material);
                    return rect;
                }
                let rect2 = createRect()
                rect2.rotation.x = -0.5 * Math.PI
                rect2.castShadow = rect2.receiveShadow = true;

                scene.add(rect2)
                // scene.receiveShadow = true

                function createBall() {
                    let geometry = new THREE.SphereGeometry(2, 2, 2)
                    let material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
                    return new THREE.Mesh(geometry, material)
                }


                var clickObjects=[];

                let objUrl = '/'
                let objMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } )
                new THREE.OBJLoader().setMaterials(objMaterial)
                    .load('/static/tree.obj', obj => {
                    console.log('callback')
                    console.log('===obj', obj)
                    obj.position.x = -100
                    obj.position.z = 0
                    obj.position.y = 0

                    obj.scale.x = 80
                    obj.scale.y = 80
                    obj.scale.z = 80
                    scene.add(obj)

                    obj.castShadow = true;


                    clickObjects.push(obj);

                })

                // objLoader.load('/static/tree.obj', obj => {
                //     console.log('callback')
                //     console.log('===obj', obj)
                //     obj.position.x = 100
                //     obj.position.z = 0
                //     obj.position.y = 0

                //     obj.scale.x = 80
                //     obj.scale.y = 80
                //     obj.scale.z = 80
                //     scene.add(obj)

                //     clickObjects.push(obj);
                // })

                var onProgress = function(xhr){
                    if(xhr.lengthComputable){
                        var percentComplete = xhr.loaded / xhr.total * 100;
                        console.log(Math.round(percentComplete, 2) + '% downloaded');
                    }
                };

                var onError = function(xhr){
                    console.error(xhr);
                };

                function initThreeClickEvent() {
                    //点击射线
                    var raycaster = new THREE.Raycaster();
                    var mouse = new THREE.Vector2();
                    document.getElementById("WebGL-output").addEventListener('mousedown', onDocumentMouseDown, false);
                    function onDocumentMouseDown(event) {
                        event.preventDefault();
                        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
                        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

                        raycaster.setFromCamera(mouse, camera);

                        console.log('click')

                        //总结一下，这里必须装网格，mesh，装入组是没有效果的
                        //所以我们将所有的盒子的网格放入对象就可以了
                        // 需要被监听的对象要存储在clickObjects中。
                        var intersects = raycaster.intersectObjects(clickObjects);
                        console.log('===length', clickObjects.length, intersects.lentgh)

                        // console.log(intersects)
                        if(intersects.length > 0) {
                            // 在这里填写点击代码
                            console.log("dianji");
                            console.log(intersects[0].object)
                            showDetailPage(intersects[0].object.name);

                        }

                    }
                }
                initThreeClickEvent()

                // new THREE.MTLLoader()
                // .setPath( '/static/new3/' )
                // .load('666.mtl', function ( materials ) {
                //     new THREE.OBJLoader().setMaterials( materials ).load('/static/new3/666.obj', obj => {
                //         console.log('callback')
                //         console.log('===obj', obj)
                //         obj.scale.multiplyScalar(.02);

                //         obj.position.x = 0
                //         obj.position.z = 0
                //         obj.position.y = 0

                //         // obj.rotation.x = -0.5 * Math.PI

                //         // obj.scale.x = 80
                //         // obj.scale.y = 80
                //         // obj.scale.z = 80
                //         scene.add(obj)
                //     })
                // })

                let animObj

                new THREE.MTLLoader()
                .setPath( '/static/miop/' )
                .load('88888.mtl', function ( materials ) {
                    // materials.preload()

                    new THREE.OBJLoader().setMaterials( materials ).load('/static/miop/88888.obj', obj => {
                        console.log('callback')
                        console.log('===obj', obj)
                        obj.scale.multiplyScalar(.02);

                        obj.position.x = 100
                        obj.position.z = 100
                        obj.position.y = 0

                        // obj.scale.x = 80
                        // obj.scale.y = 80
                        // obj.scale.z = 80
                        scene.add(obj)
                        animObj = obj
                    })
                    // new THREE.OBJLoader()
                    //     .setMaterials( materials )
                    //     .setPath( 'models/obj/male02/' )
                    //     .load( 'male02.obj', function ( object ) {

                    //         object.position.y = - 95;
                    //         scene.add( object );

                    //     }, onProgress, onError );

                } );



                var loader = new THREE.FBXLoader();
				loader.load('/static/new3/003.fbx', function ( object ) {
				// loader.load('/static/new3/3333.fbx', function ( object ) {
				// loader.load('/static/test.fbx', function ( object ) {
				// loader.load('/static/test.fbx', function ( object ) {
                    object.scale.multiplyScalar(0.01);
                    // object.position.set(0, 0, 0)
                    object.position.x = 0
                    object.position.z = 100
                    object.position.y = 0
				// loader.load('/static/miku/miku.fbx', function ( object ) {
				// loader.load( '/static/dance.fbx', function ( object ) {
                    // object.scale.x = 80
                    // object.scale.y = 80
                    // object.scale.z = 80
                    object.position.set(0, 0, 0)

                    object.rotation.x = -1.5 * Math.PI

					scene.add( object );

				}, onProgress, onError);
                // var fbxLoader = new THREE.FBXLoader()
				// fbxLoader.load('/static/dance.fbx', function ( obj ) {
                //     obj.scale.x = 80
                //     obj.scale.y = 80
                //     obj.scale.z = 80
				// 	scene.add(obj)
				// } );

                camera.lookAt(new THREE.Vector3(0, 0, 0))

                let orbit = new THREE.OrbitControls(camera, renderer.domElement)
                orbit.minDistance = 50
                orbit.maxDistance = 1000

                var clock = new THREE.Clock(); //时间跟踪

                var render = function () {
                    renderer.render(scene, camera)

                    //圆周运动
                    // if (animObj) {
                    //     var time = clock.getElapsedTime() * 1;
                    //     animObj.position.x = Math.cos( time ) * 100;
                    //     animObj.position.z = Math.sin( time ) * 100;
                    // }

                    requestAnimationFrame(render)

                    // cube.rotation.x += 0.1;
                    // cube.rotation.y += 0.1;


                }
                render();
            }
        }
    }
</script>

<style lang="scss" scoped>
.tool-box {
    position: absolute;
    right: 0;
    top: 0;
    width: 100px;
    height: 100px;
    background-color: #f00;
    z-index: 10000;
}
.earth-box {
    background-color: #fff;
}
</style>
