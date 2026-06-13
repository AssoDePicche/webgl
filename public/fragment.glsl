precision mediump float;

varying vec2 v_TextureCoordinates;
varying vec3 v_WorldPosition;
varying vec3 v_Normal;

uniform sampler2D u_Texture;

uniform vec3 u_LightAttenuation;
uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;

void main() {
    vec3 uAmbientColor = vec3(.15, .15, .15);

    vec4 textureColor = texture2D(u_Texture, v_TextureCoordinates);
    
    vec3 lightVector = u_LightPosition - v_WorldPosition;
    
    float distance = length(lightVector);

    vec3 lightDirection = normalize(lightVector);
    
    vec3 normal = normalize(v_Normal);

    float diffuseIntensity = max(dot(normal, lightDirection), 0.0);

    float attenuation = 1.0 / (u_LightAttenuation.x + u_LightAttenuation.y * distance + u_LightAttenuation.z * (distance * distance));
    
    vec3 diffuseLight = u_LightColor * diffuseIntensity * attenuation;

    vec3 finalLight = uAmbientColor + diffuseLight;
    
    gl_FragColor = vec4(textureColor.rgb * finalLight, textureColor.a);
}
