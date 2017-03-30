// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    production: false,
    ws: "ws://pi:4201",
    stations: [
        {name: "Ria 89.7", url: "http://mediacorp.rastream.com/897fm"},
        {name: "Gold 90.5 FM", url: "http://mediacorp.rastream.com/905fm"},
        {name: "91.3 Hot FM", url: "http://sph.rastream.com/913fm"},
        {name: "Kiss 92.0", url: "http://sph.rastream.com/sph-kiss92"},
        {name: "Symphony 92.4", url: "http://mediacorp.rastream.com/924fm"},
        {name: "Yes 93.3", url: "http://mediacorp.rastream.com/933fm"},
        {name: "93.8 Live", url: "http://mediacorp.rastream.com/938fm"},
        {name: "Warna 94.2", url: "http://mediacorp.rastream.com/942fm"},
        {name: "Class 95.0", url: "http://mediacorp.rastream.com/950fm"},
        {name: "95.8 Capital", url: "http://mediacorp.rastream.com/958fm"},
        {name: "Love 97.2 ", url: "http://mediacorp.rastream.com/972fm"},
        {name: "98.7 FM", url: "http://mediacorp.rastream.com/987fm"},
        {name: "Lush 99.5", url: "http://mediacorp.rastream.com/995fm"},
        {name: "UFM 100.3", url: "http://sph.rastream.com/1003fm"},
    ]
};
