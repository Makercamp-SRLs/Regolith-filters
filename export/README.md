# export
Version **0.0.2**

This filter exports the behavior pack and resource pack into a ".mcaddon", ".mcworld" or ".mctemplate" file, ready for distribution.

## Usage
This filter requires that you have [nodejs](https://nodejs.org/en/) installed.

Install this filter by running (`regolith install github.com/Makercamp-SRLs/Regolith-filters/export`). Apply the filters similar to the example:

```json
{
	"filters": [
		{
			"filter": "export",
			"settings": {
                "target": "addon",
				"exclude": [ "BP" ]
			}
		}
	]
}
```

### Settings

Name | Default | Description
---- | ------- | -----------
`target` | `''` | Select target archive.
`exclude` | `[]` | Exclude paths from being exported.

#### exclude
Exclude can only be use for addon target.
Allowed values: `BP`, `RP`.

#### target
Allowed values: `addon`, `world`, `template`.