<template>
    <my-page class="page-home" title="数学演示" :page="page">
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
    // https://nsytsqdtn.github.io/demo/vertices/vertices
    
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
                        {
                            type: 'icon',
                            icon: 'settings',
                            click: this.toggleSetting
                        }
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
                let originPt = {
                    x: 0,
                    y: 0,
                    z: 0
                }
                class Point {
                    constructor(x, y, z) {
                        this.x = x
                        this.y = y
                        this.z = z
                    }
                }



                var scene = new THREE.Scene()
                this.scene = scene
                let rect = document.getElementById('WebGL-output').getBoundingClientRect()
                var camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 1000);

                // create a render and set the size
                var webGLRenderer = new THREE.WebGLRenderer()
                webGLRenderer.setClearColor(new THREE.Color(0xffffff))
                webGLRenderer.setSize(rect.width, rect.height)
                webGLRenderer.shadowMapEnabled = true

                camera.position.x = 200;
                camera.position.y = 200;
                camera.position.z = 200;
                camera.lookAt(new THREE.Vector3(0, 0, 0))

                // 光
                let ambi = new THREE.AmbientLight(0x686868); //环境光
                scene.add(ambi);
                let spotLight = new THREE.DirectionalLight(0xffffff);  //点光源
                spotLight.position.set(550, 100, 550);
                spotLight.intensity = 1;
                scene.add(spotLight);


                // 获取position
                function getPosition(lng, lat, alt) {
                    var phi = (90-lat)*(Math.PI/180),
                        theta = (lng+180)*(Math.PI/180),
                        radius = alt,
                        x = -(radius * Math.sin(phi) * Math.cos(theta)),
                        z = (radius * Math.sin(phi) * Math.sin(theta)),
                        y = (radius * Math.cos(phi));
                    return {x: x, y: y, z: z};
                }

                // let pt = getPosition(113, 24, 40)

                // var material = new THREE.MeshBasicMaterial({
                //     color: 0xfff
                // });
                // var line = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), material);
                // scene.add(line);
                // line.position.set(pt.x, pt.y, pt.z)

                function createLine(pts, color = 0x000000) {
                    let geometry = new THREE.Geometry()
                    geometry.vertices.push(
                        pts[0],
                        pts[1]
                    );
                    geometry.colors.push(
                        new THREE.Color(color),
                        new THREE.Color(color)
                    )
                    let material = new THREE.LineBasicMaterial({ vertexColors: true })
                    var lines = new THREE.Line(geometry, material)
                    scene.add(lines);
                }

                let pt2 = getPosition(113, 24, 80)
                // createLine([
                //     new THREE.Vector3(0, 0, 0),
                //     new THREE.Vector3(pt2.x, pt2.y, pt2.z)
                // ])

                function mathPt(pt) {
                    return {
                        x: pt.y,
                        y: pt.z,
                        z: pt.x,
                    }
                }


                function createMathPoint(pt) {
                    let show = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 20), new THREE.MeshBasicMaterial({
                        color: 0x000000
                    }))
                    let showPt = mathPt(pt)
                    show.position.set(showPt.x, showPt.y, showPt.z)
                    scene.add(show)
                }




                function createMathLine(startPt, endPt, color = 0x000000) {
                    let start = mathPt(startPt)
                    let end = mathPt(endPt)
                    createLine([
                        new THREE.Vector3(start.x, start.y, start.z),
                        new THREE.Vector3(end.x, end.y, end.z)
                    ], color)
                }

                // 创建虚线
                function createMathDashLine(startPt, endPt, color = 0x000000) {
                    let start = mathPt(startPt)
                    let end = mathPt(endPt)
                    let geometry = new THREE.Geometry()
                    geometry.vertices.push(
                        new THREE.Vector3(start.x, start.y, start.z),
                        new THREE.Vector3(end.x, end.y, end.z),
                    )
                    geometry.colors.push(
                        new THREE.Color(color),
                        new THREE.Color(color)
                    )
                    let material = new THREE.LineBasicMaterial({ vertexColors: true })
                    let lines = new THREE.Line(geometry, new THREE.LineDashedMaterial({
                        color: color,
                        dashSize: 1,
                        gapSize: 3
                    }))
                    lines.computeLineDistances()
                    scene.add(lines)
                }



                // 坐标轴
                const axiosLength = 100
                createMathLine(originPt, new Point(axiosLength, 0, 0), 0xff0000)
                createMathLine(originPt, new Point(0, axiosLength, 0), 0x00ff00)
                createMathLine(originPt, new Point(0, 0, axiosLength), 0x0000ff)

                // 线
                createMathLine(new Point(100, 0, 0), new Point(0, 100, 0))
                // 点
                createMathPoint(new Point(100, 100, 100))


                createMathDashLine(new Point(100, 100, 100), new Point(100, 100, 0))
                createMathDashLine(new Point(100, 100, 0), new Point(100, 0, 0))





                // let cubeSize = 60
                // var geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
                // var material = new THREE.MeshBasicMaterial({
                //     color: 0xfff
                // });
                // var cube = new THREE.Mesh(geometry, material);
                // scene.add(cube);

                document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);


                let render = () => {
                    requestAnimFrame(render);
                    webGLRenderer.render(scene, camera);
                }

                render()

                var orbit = new THREE.OrbitControls( camera, webGLRenderer.domElement );
                orbit.minDistance = 50;
                orbit.maxDistance = 1000;
                // orbit.enableZoom = false;
                orbit.enablePan = true
                orbit.keyPanSpeed = 7.0
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
