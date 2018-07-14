<template>
    <my-page class="page-home" title="地球" :page="page">
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
                var scene = new THREE.Scene()
                this.scene = scene
                let rect = document.getElementById('WebGL-output').getBoundingClientRect()
                var camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 1000);

                // create a render and set the size
                var webGLRenderer = new THREE.WebGLRenderer()
                webGLRenderer.setClearColor(new THREE.Color(0x000000))
                webGLRenderer.setSize(rect.width, rect.height)
                webGLRenderer.shadowMapEnabled = true

                // var sphere = 
                createMesh(new THREE.SphereGeometry(40, 160, 160));
                // add the sphere to the scene
                //scene.add(sphere);

                // position and point the camera to the center of the scene
                camera.position.x = 130;
                camera.position.y = 0;
                camera.position.z = 0;
                //camera.lookAt(new THREE.Vector3(10, 0, 0));


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

                // call the render function
                var step = 0;


                var mesh = {} ;
                function createMesh(geom) {

                    // assign two materials
                    var loader = new THREE.TextureLoader();
                    var material = new THREE.MeshBasicMaterial();

                    // load a resource
                    loader.load(
                        // resource URL
                        '/static/img/earth1.jpg',
                        // Function when resource is loaded
                        function ( texture ) {
                            var s = "" ;
                            for(let a in texture){
                                s += a ;
                            }
                            // do something with the texture
                            material.map = texture ;
                            material.side = THREE.DoubleSide ;
                            material.overdraw = 0.5
                            mesh = new THREE.Mesh( geom, material ); //THREE.SceneUtils.createMultiMaterialObject(geom, [material,wireFrameMat]);
                            mesh.position.set(0, 0, 0)
                            scene.add(mesh);
                            render();
                        },
                        // Function called when download progresses
                        function ( xhr ) {
                        // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
                        },
                        // Function called when download errors
                        function ( xhr ) {
                            //console.log( 'An error happened' );
                        }
                    )
                }

                let render = () => {
                    //stats.update();
                    if (this.rotate) {
                        mesh.rotation.y = step += 0.004;
                    }
                    requestAnimFrame(render);
                    webGLRenderer.render(scene, camera);
                }

                var orbit = new THREE.OrbitControls( camera, webGLRenderer.domElement );
                orbit.minDistance = 50;
                orbit.maxDistance = 1000;
                // orbit.enableZoom = false;
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
