
L.OSMBuildings = L.Class.extend({
  includes: [L.Mixin.Events, OSMBuildings.prototype],

  options: {
    opacity: 1.0
  },

  initialize: function (options) {
    L.setOptions(this, options);
    this._osmb = new OSMBuildings(options);
  },

  onAdd: function (map) {
    this._map = map;
    this._osmb.appendTo(map._panes.overlayPane, map._size.x, map._size.y);
    this._osmb.container.style.position = 'absolute';

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      L.DomUtil.addClass(this._osmb.container, 'leaflet-zoom-animated');
    } else {
      L.DomUtil.addClass(this._osmb.container, 'leaflet-zoom-hide');
    }

    this._updateOpacity();

    map.on('viewreset', this._endZoom, this);
    map.on('move', this._move, this);
    map.on('resize', this._resize, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._startZoom, this);
    }

    this._endZoom();
  },

  onRemove: function (map) {
    map.getPanes().overlayPane.removeChild(this._osmb.container);

    map.off('viewreset', this._endZoom, this);
    map.off('move', this._move, this);
    map.off('resize', this._resize, this);

    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._startZoom, this);
    }
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  setOpacity: function (opacity) {
    this.options.opacity = opacity;
    this._updateOpacity();
    return this;
  },

  bringToFront: function () {
    if (this._osmb.container) {
      this._map._panes.overlayPane.appendChild(this._osmb.container);
    }
    return this;
  },

  bringToBack: function () {
    var pane = this._map._panes.overlayPane;
    if (this._osmb.container) {
      pane.insertBefore(this._osmb.container, pane.firstChild);
    }
    return this;
  },

  getAttribution: function () {
    // TODO
    return this.options.attribution;
  },

  _updateOpacity: function () {
    L.DomUtil.setOpacity(this._osmb.container, this.options.opacity);
  },

  _endZoom: function () {
    clearTimeout(this._zooming);

    this._move();
    this._osmb.setZoom(this._map._zoom);
  },

  _resize: function() {
    var map = this._map;
    this._osmb.setSize({ width:map._size.x, height:map._size.y });
  },

  _move: function() {
    var
      pos = this._map.getCenter(),
      osmb = this._osmb;

    osmb.setPosition({ latitude:pos.lat, longitude:pos.lng });
    var offset = L.DomUtil.getPosition(this._map._mapPane);
    osmb.container.style.left = -offset.x + 'px';
    osmb.container.style.top  = -offset.y + 'px';

    // TODO: could also be a zoomchange?
  },

  _startZoom: function (e) {
    this._zoomScale = this._map.getZoomScale(e.zoom);
    this._zoomStep();
  },

  _zoomStep: function() {
    var
      map = this._map,
      sizeX = map._size.x,
      offX = -2 * map._panes.tilePane.firstChild.children[1].getBoundingClientRect().right,
      scale = (sizeX + offX) / sizeX,
      zoom = map._zoom;

    if (this._zoomScale === 0.5) {
      zoom += 2 * (scale-1);
    } else {
      zoom += scale-1;
    }

    this._osmb.setZoom(zoom);
    this._zooming = setTimeout(this._zoomStep.bind(this), 10);
  }

});

L.osmBuildings = function (options) {
  return new L.OSMBuildings(options);
};
