<template>
    <my-page class="page-home" title="太阳系" :page="page">
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
                rotate: true,
                settingVisible: false,
                page: {
                    menu: [
                        // {
                        //     type: 'icon',
                        //     icon: 'settings',
                        //     click: this.toggleSetting
                        // }
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
                var scene = new THREE.Scene()
                this.scene = scene
                let rect = document.getElementById('WebGL-output').getBoundingClientRect()
                let camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 10000);
                // let camera = new THREE.OrthographicCamera(0 - rect.width, rect.width, 0 - rect.height, rect.height, 100, 3000)

                // create a render and set the size
                var webGLRenderer = new THREE.WebGLRenderer()
                webGLRenderer.setClearColor(new THREE.Color(0x000000))
                webGLRenderer.setSize(rect.width, rect.height)
                webGLRenderer.shadowMapEnabled = true

                const SHUI = 4878
                const EARTH = 12756.3
                const JIN = 12103.6
                let scale = 30 / EARTH 
                var loader = new THREE.TextureLoader()
                // 水星
                new THREE.TextureLoader().load('/static/img/shui_s.jpg', texture => {
                    let material = new THREE.MeshBasicMaterial()
                    material.map = texture
                    material.side = THREE.DoubleSide
                    material.overdraw = 0.5
                    let geom = new THREE.SphereGeometry(SHUI * scale, 160, 160)
                    let mesh = new THREE.Mesh(geom, material)
                    mesh.position.set(-50, 0, 0)
                    scene.add(mesh)
                })

                // 金星
                new THREE.TextureLoader().load('/static/img/jin_s.jpg', texture => {
                    let material = new THREE.MeshBasicMaterial()
                    material.map = texture
                    material.side = THREE.DoubleSide
                    material.overdraw = 0.5
                    let geom = new THREE.SphereGeometry(JIN * scale, 160, 160)
                    let mesh = new THREE.Mesh(geom, material)
                    mesh.position.set(0, 0, 0)
                    scene.add(mesh)
                })
                // 地球
                new THREE.TextureLoader().load('/static/img/earth_s.jpg', texture => {
                    let material = new THREE.MeshBasicMaterial()
                    material.map = texture
                    material.side = THREE.DoubleSide
                    material.overdraw = 0.5
                    let geom = new THREE.SphereGeometry(EARTH * scale, 160, 160)
                    let mesh = new THREE.Mesh(geom, material)
                    mesh.position.set(100, 0, 0)
                    scene.add(mesh)
                })
                // 月球
                new THREE.TextureLoader().load('/static/img/moon_s.jpg', texture => {
                    let material = new THREE.MeshBasicMaterial()
                    material.map = texture
                    material.side = THREE.DoubleSide
                    material.overdraw = 0.5
                    let geom = new THREE.SphereGeometry(EARTH / 4 * scale, 160, 160)
                    let mesh = new THREE.Mesh(geom, material)
                    mesh.position.set(150, 0, 0)
                    scene.add(mesh)
                })
                // 火星
                new THREE.TextureLoader().load('/static/img/huo_s.jpg', texture => {
                    let material = new THREE.MeshBasicMaterial()
                    material.map = texture
                    material.side = THREE.DoubleSide
                    material.overdraw = 0.5
                    let geom = new THREE.SphereGeometry(6794 * scale, 160, 160)
                    let mesh = new THREE.Mesh(geom, material)
                    mesh.position.set(200, 0, 0)
                    scene.add(mesh)
                })
                // 木星
                new THREE.TextureLoader().load('/static/img/mu_s.jpg', texture => {
                    let material = new THREE.MeshBasicMaterial()
                    material.map = texture
                    material.side = THREE.DoubleSide
                    material.overdraw = 0.5
                    let geom = new THREE.SphereGeometry(142984 * scale, 160, 160)
                    let mesh = new THREE.Mesh(geom, material)
                    mesh.position.set(800, 0, 0)
                    scene.add(mesh)
                })
                // 土星
                new THREE.TextureLoader().load('/static/img/tu_s.jpg', texture => {
                    let material = new THREE.MeshBasicMaterial()
                    material.map = texture
                    material.side = THREE.DoubleSide
                    material.overdraw = 0.5
                    let geom = new THREE.SphereGeometry(120536 * scale, 160, 160)
                    let mesh = new THREE.Mesh(geom, material)
                    mesh.position.set(1500, 0, 0)
                    scene.add(mesh)
                })
                // 天王星
                new THREE.TextureLoader().load('/static/img/tian_s.jpg', texture => {
                    let material = new THREE.MeshBasicMaterial()
                    material.map = texture
                    material.side = THREE.DoubleSide
                    material.overdraw = 0.5
                    let geom = new THREE.SphereGeometry(51118 * scale, 160, 160)
                    let mesh = new THREE.Mesh(geom, material)
                    mesh.position.set(2000, 0, 0)
                    scene.add(mesh)
                })
                // 海王星
                new THREE.TextureLoader().load('/static/img/hai_s.jpg', texture => {
                    let material = new THREE.MeshBasicMaterial()
                    material.map = texture
                    material.side = THREE.DoubleSide
                    material.overdraw = 0.5
                    let geom = new THREE.SphereGeometry(49528 * scale, 160, 160)
                    let mesh = new THREE.Mesh(geom, material)
                    mesh.position.set(2400, 0, 0)
                    scene.add(mesh)
                })

                // add the sphere to the scene
                //scene.add(sphere);

                // position and point the camera to the center of the scene
                camera.position.x = 0
                camera.position.y = 0
                camera.position.z = 300
                // camera.lookAt(new THREE.Vector3(0, 0, 0))


                let ambi = new THREE.AmbientLight(0x686868); //环境光
                scene.add(ambi);
                let spotLight = new THREE.DirectionalLight(0xffffff);  //点光源
                spotLight.position.set(550, 100, 550);  
                spotLight.intensity = 1;
                scene.add(spotLight);


                var geometry=new THREE.SphereGeometry(50, 30, 30);
                //定义一种材质，显示为线框
                var material = new THREE.MeshBasicMaterial({color:0xB3DD,wireframe:true});
                //网孔(Mesh)是用来承载几何模型的一个对象，可以把材料应用到它上面
                var ball = new THREE.Mesh(geometry, material);
                //把几何模型添加到场景中，对象被添加到原点(0,0,0)坐标。
                scene.add(ball);
                ball.position.set(lglt2xyz(113, 24, 40))


                // add the output of the renderer to the html element
                document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

                let cameraX = 0
                let targetX = 0
                let cameraZ = 300
                let targetZ = 300

                let render = () => {
                    console.log('渲染')
                    if (cameraX !== targetX) {
                        if (cameraX < targetX) {
                            cameraX += 10
                            if (cameraX > targetX) {
                                cameraX = targetX
                            }
                        } else {
                            cameraX -= 10
                            if (cameraX < targetX) {
                                cameraX = targetX
                            }
                        }
                    }
                    if (cameraZ !== targetZ) {
                        if (cameraZ < targetZ) {
                            cameraZ += 10
                            if (cameraZ > targetZ) {
                                cameraZ = targetZ
                            }
                        } else {
                            cameraZ -= 10
                            if (cameraZ < targetZ) {
                                cameraZ = targetZ
                            }
                        }
                    }
                    camera.position.set(cameraX, 0, cameraZ)
                    camera.lookAt(cameraX, 0, 0)

                    requestAnimFrame(render);
                    webGLRenderer.render(scene, camera);
                }

                render()

                // var orbit = new THREE.OrbitControls( camera, webGLRenderer.domElement );
                // orbit.minDistance = 50;
                // orbit.maxDistance = 1000;
                // orbit.enableZoom = false;

                
                document.addEventListener('keydown', e => {
                    console.log(e.keyCode)
                    switch (e.keyCode) {
                        case 39: // right
                            targetX = cameraX + 100
                            break
                        case 37: //left
                            targetX = cameraX - 100
                            break
                        case 38: // top
                            targetZ = cameraZ - 100
                            break
                        case 40: // bottom
                            targetZ = cameraZ + 100
                            break
                    }
                    if (e.keyCode >= 49 && e.keyCode <= 49 + 9) {
                        let idx = e.keyCode - 49
                        let radiusList = [SHUI, JIN, EARTH, EARTH / 4, 6794, 142984, 120536, 51118, 49528]
                        let xList = [-50, 0, 100, 150, 200, 800, 1500, 2000, 2400]
                        let radius = radiusList[idx] * scale
                        targetX = xList[idx]
                        targetZ = radius * 4
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
