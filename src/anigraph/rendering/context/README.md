# Rendering Contexts in AniGraph

How do we manage rendering contexts in AniGraph?

### AGLContext
This represents a single rendering context. It contains a `THREE.WebGLRenderer`


### AGLContextView
This connects a context to a DOM element. Also has the ability to record a screenshot.
