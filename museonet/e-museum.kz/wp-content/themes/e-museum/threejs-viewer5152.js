(function(){
    var observer = null;
    
    function init() {
        if (typeof THREE === 'undefined' || typeof THREE.OBJLoader === 'undefined') {
            setTimeout(init, 200);
            return;
        }
        
        observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    if (!el.classList.contains('loaded')) {
                        el.classList.add('loaded');
                        startViewer(el);
                    }
                    observer.unobserve(el);
                }
            });
        }, {rootMargin: '100px'});
        
        document.querySelectorAll('.obj-viewer:not(.loaded)').forEach(function(el) {
            observer.observe(el);
        });
    }
    
    function startViewer(box) {
        var url = box.getAttribute('data-obj');
        var diffuse = box.getAttribute('data-diffuse') || '';
        var normal = box.getAttribute('data-normal') || '';
        var metallic = box.getAttribute('data-metallic') || '';
        var roughness = box.getAttribute('data-roughness') || '';
        
        var w = box.clientWidth || 300;
        var h = box.clientHeight || 300;
        
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 1000);
        camera.position.set(0, 0, 5);
        
        var renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
        renderer.setSize(w, h);
        renderer.outputEncoding = THREE.sRGBEncoding; // Правильные цвета
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        box.innerHTML = '';
        box.appendChild(renderer.domElement);
        
        // Улучшенное освещение
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        
        var light1 = new THREE.DirectionalLight(0xffffff, 0.8);
        light1.position.set(5, 10, 7);
        scene.add(light1);
        
        var light2 = new THREE.DirectionalLight(0xffffff, 0.3);
        light2.position.set(-5, -5, -5);
        scene.add(light2);
        
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        
        var matParams = {
            color: 0xcccccc, 
            side: THREE.DoubleSide, 
            metalness: 0.0, 
            roughness: 0.8
        };
        
        var texLoader = new THREE.TextureLoader();
        var toLoad = 0;
        var loaded = 0;
        
        if (diffuse) toLoad++;
        if (normal) toLoad++;
        if (metallic) toLoad++;
        if (roughness) toLoad++;
        
        function onLoad() {
            loaded++;
            if (loaded >= toLoad) loadModel();
        }
        
        if (diffuse) {
            texLoader.load(diffuse, function(t) {
                t.flipY = true; // Попробуй true вместо false
                t.encoding = THREE.sRGBEncoding; // Важно для цвета!
                matParams.map = t;
                matParams.color = 0xffffff;
                onLoad();
            }, null, onLoad);
        }
        
        if (normal) {
            texLoader.load(normal, function(t) {
                t.flipY = true;
                matParams.normalMap = t;
                matParams.normalScale = new THREE.Vector2(1, 1);
                onLoad();
            }, null, onLoad);
        }
        
        if (metallic) {
            texLoader.load(metallic, function(t) {
                t.flipY = true;
                matParams.metalnessMap = t;
                matParams.metalness = 1.0;
                onLoad();
            }, null, onLoad);
        }
        
        if (roughness) {
            texLoader.load(roughness, function(t) {
                t.flipY = true;
                matParams.roughnessMap = t;
                matParams.roughness = 1.0;
                onLoad();
            }, null, onLoad);
        }
        
        if (toLoad === 0) loadModel();
        
        function loadModel() {
            var mat = new THREE.MeshStandardMaterial(matParams);
            var loader = new THREE.OBJLoader();
            loader.load(url, function(obj) {
                var b = new THREE.Box3().setFromObject(obj);
                var c = b.getCenter(new THREE.Vector3());
                var s = b.getSize(new THREE.Vector3());
                var scale = 3 / Math.max(s.x, s.y, s.z);
                obj.scale.multiplyScalar(scale);
                obj.position.sub(c.multiplyScalar(scale));
                obj.traverse(function(child){ 
                    if(child.isMesh) child.material = mat; 
                });
                scene.add(obj);
            });
        }
        
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    }
    
    document.addEventListener('DOMContentLoaded', init);
    setTimeout(function() {
        document.querySelectorAll('.obj-viewer:not(.loaded)').forEach(function(el) {
            if (observer) observer.observe(el);
        });
    }, 2000);
})();