/***
L.ImageOverlay = L.Class.extend({

  _initImage: function () {
    this._image = L.DomUtil.create('img', 'leaflet-image-layer');

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
    } else {
      L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
    }

    this._updateOpacity();

    //TODO createImage util method to remove duplication
    L.extend(this._image, {
      galleryimg: 'no',
      onselectstart: L.Util.falseFn,
      onmousemove: L.Util.falseFn,
      onload: L.bind(this._onImageLoad, this)
    });
  },

  _animateZoom: function (e) {
    var map = this._map,
      image = this._image,
      scale = map.getZoomScale(e.zoom),

      topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
      size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
      origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));

    image.style[L.DomUtil.TRANSFORM] =
      L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
  },

  _reset: function () {
    var image   = this._image;

    L.DomUtil.setPosition(image, topLeft);

    image.style.width  = size.x + 'px';
    image.style.height = size.y + 'px';
  },

  _onImageLoad: function () {
    this.fire('load');
  },

  _updateOpacity: function () {
    L.DomUtil.setOpacity(this._image, this.options.opacity);
  }
});


***/

L.OSMBuildings = L.Class.extend({
  includes: [L.Mixin.Events, OSMBuildings.prototype],

  options: {
    opacity: 1
  },

  initialize: function (options) { // (String, LatLngBounds, Object)
    L.setOptions(this, options);
    this._osmb = new OSMBuildings(options);
  },

  onAdd: function (map) {
    this._map = map;
    this._osmb.appendTo(map._panes.overlayPane, map._size.x, map._size.y);

    // map.on('viewreset', this._reset, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
    //   map.on('zoomanim', this._animateZoom, this);
    }

    // this._reset();
  },

  onRemove: function (map) {
    // map.getPanes().overlayPane.removeChild(this._osmb);

    // map.off('viewreset', this._reset, this);

    if (map.options.zoomAnimation) {
      // map.off('zoomanim', this._animateZoom, this);
    }
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  setOpacity: function (opacity) {
    this.options.opacity = opacity;
    // this._updateOpacity();
    return this;
  },

  bringToFront: function () {
    // if (this._image) {
    //   this._map._panes.overlayPane.appendChild(this._image);
    // }
    return this;
  },

  bringToBack: function () {
    var pane = this._map._panes.overlayPane;
    // if (this._image) {
    //   pane.insertBefore(this._image, pane.firstChild);
    // }
    return this;
  },

  getAttribution: function () {
    return this.options.attribution;
  }
  
});

L.osmBuildings = function (options) {
  return new L.OSMBuildings(options);
};







/***
  var
    off = this.getOffset(),
    po = map.getPixelOrigin();
  setSize({ width:map._size.x, height:map._size.y });
  setOrigin({ x:po.x-off.x, y:po.y-off.y });
  setZoom(map._zoom);

  Layers.setPosition(-off.x, -off.y);

  map.on({
    move:      this.onMove,
    moveend:   this.onMoveEnd,
    zoomstart: this.onZoomStart,
    zoomend:   this.onZoomEnd,
    resize:    this.onResize,
    viewreset: this.onViewReset,
    click:     this.onClick
  }, this);

  if (map.options.zoomAnimation) {
    map.on('zoomanim', this.onZoom, this);
  }

  if (map.attributionControl) {
    map.attributionControl.addAttribution(ATTRIBUTION);
  }

  Data.update();


/***
this.offset = { x:0, y:0 };

L.OSMBuildings.prototype.onRemove = function() {
  var map = this.map;
  if (map.attributionControl) {
    map.attributionControl.removeAttribution(ATTRIBUTION);
  }

  map.off({
    move:      this.onMove,
    moveend:   this.onMoveEnd,
    zoomstart: this.onZoomStart,
    zoomend:   this.onZoomEnd,
    resize:    this.onResize,
    viewreset: this.onViewReset,
    click:     this.onClick
  }, this);

  if (map.options.zoomAnimation) {
    map.off('zoomanim', this.onZoom, this);
  }
  Layers.remove();
  map = null;
};

L.OSMBuildings.prototype.onMove = function(e) {
  var off = this.getOffset();
  moveCam({ x:this.offset.x-off.x, y:this.offset.y-off.y });
};

L.OSMBuildings.prototype.onMoveEnd = function(e) {
  if (this.noMoveEnd) { // moveend is also fired after zoom
    this.noMoveEnd = false;
    return;
  }

  var
    map = this.map,
    off = this.getOffset(),
    po = map.getPixelOrigin();

  this.offset = off;
  Layers.setPosition(-off.x, -off.y);
  moveCam({ x:0, y:0 });

  setSize({ width:map._size.x, height:map._size.y }); // in case this is triggered by resize
  setOrigin({ x:po.x-off.x, y:po.y-off.y });
  onMoveEnd(e);
};

L.OSMBuildings.prototype.onZoomStart = function(e) {
  onZoomStart(e);
};

L.OSMBuildings.prototype.onZoom = function(e) {
//    var map = this.map,
//        scale = map.getZoomScale(e.zoom),
//        offset = map._getCenterOffset(e.center).divideBy(1 - 1/scale),
//        viewportPos = map.containerPointToLayerPoint(map.getSize().multiplyBy(-1)),
//        origin = viewportPos.add(offset).round();
//
//    this.container.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString((origin.multiplyBy(-1).add(this.getOffset().multiplyBy(-1)).multiplyBy(scale).add(origin))) + ' scale(' + scale + ') ';
//    isZooming = true;
};

L.OSMBuildings.prototype.onZoomEnd = function(e) {
  var
    map = this.map,
    off = this.getOffset(),
    po = map.getPixelOrigin();

  setOrigin({ x:po.x-off.x, y:po.y-off.y });
  onZoomEnd({ zoom:map._zoom });
  this.noMoveEnd = true;
};

L.OSMBuildings.prototype.onResize = function() {};

L.OSMBuildings.prototype.onViewReset = function() {
  var off = this.getOffset();

  this.offset = off;
  Layers.setPosition(-off.x, -off.y);
  moveCam({ x:0, y:0 });
};

L.OSMBuildings.prototype.onClick = function(e) {
  var id = HitAreas.getIdFromXY(e.containerPoint.x, e.containerPoint.y);
  if (id) {
    onClick({ feature:id, lat:e.latlng.lat, lon:e.latlng.lng });
  }
};

L.OSMBuildings.prototype.getOffset = function() {
  return L.DomUtil.getPosition(this.map._mapPane);
};
***/