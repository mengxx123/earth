
<template>
    <my-page class="page-home" title="测试" :page="page">
        <div class="earth-box" id="WebGL-output"></div>
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
            init() {
                const METRE = 2

                var scene = new THREE.Scene();
                let rect = document.getElementById('WebGL-output').getBoundingClientRect()
                var camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000)
                camera.position.z = 400 * METRE
                camera.position.x = 80 * METRE
                camera.position.y = 80 * METRE



                var renderer = new THREE.WebGLRenderer({
                    antialias: true
                })

                renderer.setSize( window.innerWidth, window.innerHeight );

                document.getElementById("WebGL-output").appendChild(renderer.domElement);
                // document.body.appendChild( renderer.domElement );

                function createTopPanel() {

                }




                var planeGeo = new THREE.BoxGeometry(320 * METRE, 1 * METRE, 320 * METRE)
                // var planeGeo = new THREE.PlaneGeometry(100,100,100,20);//创建平面
                var planeMat = new THREE.MeshLambertMaterial({  //创建材料
                    color: 0xffff00,
                    wireframe: false
                });
                var ground = new THREE.TextureLoader().load( "/static/ground.jpg" );
                //平面使用颜色为0xcccccc的基本材质
                var planeMaterial = new THREE.MeshBasicMaterial({map: ground});
                var planeMesh = new THREE.Mesh(planeGeo, planeMaterial);//创建网格模型
                planeMesh.position.set(0, 0, 40);//设置平面的坐标
                // planeMesh.rotation.x = 0
                planeMesh.position.x = 0
                planeMesh.position.y = -1 * METRE
                planeMesh.position.z = 0
                scene.add(planeMesh);//将平面添加到场景中

                function makeMesh(type, geometry, color) {
                    var material
                    if (type === 'lambert') {
                    material = new THREE.MeshLambertMaterial({color: color})
                    } else if (type === 'phong') {
                    material = new THREE.MeshPhongMaterial({color: color})
                    } else {
                    console.error('unrecognized type!')
                    }

                    mesh = new THREE.Mesh(geometry, material)
                    mesh.castShadow = true
                    mesh.receiveShadow = true
                    return mesh
                }
                function createHouse() {
                    let texture = new THREE.TextureLoader().load( "/static/ball.jpg" );
                    let sphereMaterial = new THREE.MeshBasicMaterial({map: texture})
                    let geometry = new THREE.BoxGeometry(10 * METRE, 20 * METRE, 10 * METRE)
                    let material = new THREE.MeshBasicMaterial( { color: 11397866 } );
                    material = new THREE.MeshLambertMaterial({color: 0xffffff})

                    return new THREE.Mesh(geometry, material)
                }
                let house = createHouse()
                house.position.z = 0
                house.position.x = 0
                house.position.y = 10 * METRE
                scene.add(house)


                function createRoad() {
                    let planeGeo = new THREE.PlaneGeometry(10 * METRE, 20 * METRE, 0)
                    let planeMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffffff
                    })
                    let planeMesh = new THREE.Mesh(planeGeo, planeMaterial)
                    planeMesh.position.set(0, 0, 10 * METRE)
                    // planeMesh.rotation.x = 0
                    // planeMesh.position.x = 0
                    planeMesh.rotation.set(-0.5 * Math.PI, 0, 0); // 沿着 X轴旋转-90°
                    return planeMesh
                }
                scene.add(createRoad())

                function createBall() {
                    let texture = new THREE.TextureLoader().load( "/static/ball.jpg" );
                    let sphereMaterial = new THREE.MeshBasicMaterial({map: texture})
                    let geometry = new THREE.SphereGeometry(2, 2, 2)
                    let material = new THREE.MeshBasicMaterial( { color: 11397866 } );
                    return new THREE.Mesh(geometry, material)
                }
                let ball = createBall()
                ball.position.z = 0
                ball.position.x = 0
                ball.position.y = 0
                scene.add(ball)
                // ball.setPosition(0, 0, 0)

                function createSun() {
                    let texture = new THREE.TextureLoader().load( "/static/ball.jpg" );
                    let sphereMaterial = new THREE.MeshBasicMaterial({map: texture})
                    let geometry = new THREE.SphereGeometry(2, 2, 2)
                    let material = new THREE.MeshBasicMaterial( { color: 11397866 } );
                    return new THREE.Mesh(geometry, material)
                }
                let sun = createSun()
                sun.position.z = 0
                sun.position.x = 0
                sun.position.y = 500 * METRE
                scene.add(sun)

                let spotLight = new THREE.DirectionalLight(0xffffff)
                spotLight.position.set(200 * METRE, 500 * METRE, 0)
                spotLight.intensity = 1
                scene.add(spotLight)


                var textureLoader = new THREE.TextureLoader();
                var diceMaterials = [
                    new THREE.MeshBasicMaterial({ map: textureLoader.load( '/static/dice/nx.png' ) }),
                    new THREE.MeshBasicMaterial({ map: textureLoader.load( '/static/dice/ny.png' ) }),
                    new THREE.MeshBasicMaterial({ map: textureLoader.load( '/static/dice/nz.png' ) }),
                    new THREE.MeshBasicMaterial({ map: textureLoader.load( '/static/dice/px.png' ) }),
                    new THREE.MeshBasicMaterial({ map: textureLoader.load( '/static/dice/py.png' ) }),
                    new THREE.MeshBasicMaterial({ map: textureLoader.load( '/static/dice/pz.png' ) })
                ]

                var geometry = new THREE.BoxGeometry(20, 20, 20)

                var material = new THREE.MeshBasicMaterial( { color: 11397866 } );

                var cube = new THREE.Mesh(geometry, diceMaterials)
                cube.position.z = 0
                cube.position.x = 0
                cube.position.y = 0
                // scene.add( cube );

        //         var line = new THREE.Line( geometry, material );
        // line.position.x = 200;
        // line.position.y = 20 * i - 200;
        // line.rotation.z = 90 * Math.PI / 180;
        // scene.add(line);


                camera.lookAt(new THREE.Vector3(0, 0, 0))

                let orbit = new THREE.OrbitControls(camera, renderer.domElement)
                orbit.minDistance = 50
                orbit.maxDistance = 1000

                var render = function () {
                    renderer.render(scene, camera)

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

</style>
