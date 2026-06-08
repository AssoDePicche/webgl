precision mediump float;

varying vec2 fragTextureCoord;
varying vec3 vWorldPosition;
varying vec3 vNormal;

uniform sampler2D uTexture;

void main() {
    vec3 uAmbientColor = vec3(.15, .15, .15);

    vec3 uLightColor = vec3(1, 1, 1);

    vec3 uAttenuation = vec3(1, 0.09, 0.032);

    vec3 uLightPosition = vec3(0, 2, 3);

    vec4 textureColor = texture2D(uTexture, fragTextureCoord);
    
    vec3 lightVector = uLightPosition - vWorldPosition;
    
    float distance = length(lightVector);

    vec3 lightDirection = normalize(lightVector);
    
    vec3 normal = normalize(vNormal);

    float diffuseIntensity = max(dot(normal, lightDirection), 0.0);

    float attenuation = 1.0 / (uAttenuation.x + uAttenuation.y * distance + uAttenuation.z * (distance * distance));
    
    vec3 diffuseLight = uLightColor * diffuseIntensity * attenuation;

    vec3 finalLight = uAmbientColor + diffuseLight;
    
    gl_FragColor = vec4(textureColor.rgb * finalLight, textureColor.a);
}
